import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesMapper } from './roles.mapper';
import { Role } from '../entities/role.entity';
import { RoleSharedMapper } from '../shared/mappers/role-shared.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService, RolesMapper, RoleSharedMapper],
  exports: [RolesService],
})
export class RolesModule {}
