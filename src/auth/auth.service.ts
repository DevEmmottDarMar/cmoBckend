import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role?: {
      id: string;
      name: string;
      description: string;
    } | null;
    roleId?: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      this.logSecurityEvent('LOGIN_FAILED', loginDto.email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.generateRefreshToken(user.id);

    this.logSecurityEvent('LOGIN_SUCCESS', user.email);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role ? {
          id: user.role.id,
          name: user.role.name,
          description: user.role.description,
        } : null,
        roleId: user.roleId,
      },
    };
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
      relations: ['user'],
    });

    if (!tokenEntity || tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const payload: JwtPayload = {
      sub: tokenEntity.user.id,
      email: tokenEntity.user.email,
      name: tokenEntity.user.name,
    };

    const access_token = this.jwtService.sign(payload);
    const new_refresh_token = await this.generateRefreshToken(
      tokenEntity.user.id,
    );

    // Revocar el token anterior
    await this.revokeRefreshToken(refreshToken);

    return {
      access_token,
      refresh_token: new_refresh_token,
      user: {
        id: tokenEntity.user.id,
        email: tokenEntity.user.email,
        name: tokenEntity.user.name,
        phone: tokenEntity.user.phone,
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.revokeRefreshToken(refreshToken);
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    await this.refreshTokenRepository.save({
      token,
      userId,
      expiresAt,
    });

    return token;
  }

  private async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update({ token }, { isRevoked: true });
  }

  private logSecurityEvent(event: string, userEmail: string): void {
    this.logger.warn(`Security Event: ${event} - User: ${userEmail}`);
  }

  async validateToken(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }
    return user;
  }
}
