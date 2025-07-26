import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { TrabajosModule } from './trabajos/trabajos.module';
import { PermisosModule } from './permisos/permisos.module';
import { TiposPermisoModule } from './tipos-permiso/tipos-permiso.module';
import { ImagenesModule } from './imagenes/imagenes.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 10, // 10 requests por minuto
      },
      {
        ttl: 3600000, // 1 hora
        limit: 100, // 100 requests por hora
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          // Usar DATABASE_URL si está disponible
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: {
              rejectUnauthorized: false,
            },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize:
              configService.get<string>('NODE_ENV') === 'development',
            logging: configService.get<string>('NODE_ENV') === 'development',
          };
        } else {
          // Fallback a variables individuales
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST') || 'localhost',
            port: parseInt(configService.get<string>('DB_PORT') || '5432'),
            username: configService.get<string>('DB_USERNAME') || 'postgres',
            password: configService.get<string>('DB_PASSWORD') || 'password',
            database: configService.get<string>('DB_NAME') || 'nestjs_db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize:
              configService.get<string>('NODE_ENV') === 'development',
            logging: configService.get<string>('NODE_ENV') === 'development',
          };
        }
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    TrabajosModule,
    PermisosModule,
    TiposPermisoModule,
    ImagenesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
