import { Usuario } from '../entities/usuario.entity';

export class UsuarioAdapter {
  static toResponse(usuario: Usuario) {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      dni: usuario.dni,
      telefono: usuario.telefono,
      fotoUrl: usuario.fotoUrl,
      activo: usuario.activo,
      rol: usuario.rol ? usuario.rol.nombreRol : null,
      idEntidad: usuario.idEntidad,
      entidad: usuario.entidad ? usuario.entidad.nombre : null,
    };
  }
}
