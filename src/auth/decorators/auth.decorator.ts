import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {
  // applyDecorators lo que hace es permitirme unir varios decoradores en uno solo
  return applyDecorators(
    RoleProtected(...roles), // Marco los roles que necesito
    UseGuards(AuthGuard('jwt'), UserRoleGuard), // Aplico el guard de JWT y el de Roles
  );
}
