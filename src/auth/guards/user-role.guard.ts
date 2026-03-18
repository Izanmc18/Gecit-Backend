/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Obtenemos los roles que definimos en el controlador mediante @RoleProtected
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    // Si no definimos roles en el controlador, cualquier usuario autenticado pasa
    if (!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as Usuario; // El usuario lo inyecta el JwtStrategy

    if (!user)
      throw new BadRequestException('Usuario no encontrado en la petición');

    // 2. Comparamos el rol del usuario (usuario.rol.nombreRol) con los permitidos
    // Nota: Es importante que el JwtStrategy haga el 'eager load' o join del rol
    if (validRoles.includes(user.rol.nombreRol)) {
      return true;
    }

    throw new ForbiddenException(
      `El usuario ${user.nombre} necesita uno de estos roles: [${validRoles}]`,
    );
  }
}
