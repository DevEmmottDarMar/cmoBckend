import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersMapper } from './users.mapper';
import { User } from '../entities/user.entity';
import { UserSharedMapper } from '../shared/mappers/user-shared.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersMapper, UserSharedMapper],
  exports: [UsersService],
})
export class UsersModule {}
