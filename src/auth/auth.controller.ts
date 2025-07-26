import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateUserRequestSchema,
  ApiErrorResponseSchema,
} from '../common/swagger/schemas';
import { AuthService, AuthResponse } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../entities/user.entity';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario y automáticamente inicia sesión',
  })
  @ApiBody({
    type: CreateUserRequestSchema,
    description: 'Datos del usuario a registrar',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'Token JWT de acceso' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
    type: ApiErrorResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    type: ApiErrorResponseSchema,
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.usersService.create(createUserDto);
    const loginDto: LoginDto = {
      email: createUserDto.email,
      password: createUserDto.password,
    };
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ThrottlerGuard)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario con email y contraseña',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@demo.com' },
        password: { type: 'string', example: '123456' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'Token JWT de acceso' },
        refresh_token: { type: 'string', description: 'Token de renovación' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    type: ApiErrorResponseSchema,
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiados intentos de login',
    type: ApiErrorResponseSchema,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar token de acceso',
    description: 'Renueva el token de acceso usando un refresh token válido',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string', description: 'Token de renovación' },
      },
      required: ['refresh_token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Nuevo token JWT de acceso',
        },
        refresh_token: {
          type: 'string',
          description: 'Nuevo token de renovación',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
    type: ApiErrorResponseSchema,
  })
  async refresh(
    @Body() body: { refresh_token: string },
  ): Promise<AuthResponse> {
    return this.authService.refresh(body.refresh_token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Revoca el refresh token para cerrar la sesión',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          description: 'Token de renovación a revocar',
        },
      },
      required: ['refresh_token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Sesión cerrada exitosamente' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    type: ApiErrorResponseSchema,
  })
  async logout(
    @Body() body: { refresh_token: string },
  ): Promise<{ success: boolean; message: string }> {
    await this.authService.logout(body.refresh_token);
    return { success: true, message: 'Sesión cerrada exitosamente' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description:
      'Retorna la información del usuario autenticado usando el token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        phone: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de acceso requerido',
    type: ApiErrorResponseSchema,
  })
  async getProfile(@CurrentUser() user: User): Promise<any> {
    const { password, ...userProfile } = user;
    return {
      ...userProfile,
      role: user.role ? {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
      } : null,
      roleId: user.roleId,
    };
  }
}
