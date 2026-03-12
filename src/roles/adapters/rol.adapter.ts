import { Rol } from '../entities/rol.entity';

export class RolAdapter {
  static toResponse(rol: Rol) {
    return {
      id: rol.id,
      nombreRol: rol.nombreRol,
    };
  }

  static toResponseList(roles: Rol[]) {
    return roles.map((rol) => this.toResponse(rol));
  }
}
