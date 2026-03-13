import { Usuario } from '../entities/usuario.entity';

export class UsuarioResponse {
  id: string;
  idRol: string;
  nombre: string;
  apellidos: string;
  email: string;
  fotoUrl: string | null;
}

export class UsuarioAdapter {
  static toResponse(usuario: Usuario): UsuarioResponse {
    return {
      id: usuario.id,
      idRol: usuario.idRol,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      fotoUrl: usuario.fotoUrl || null,
    };
  }

  static toResponseList(usuarios: Usuario[]): UsuarioResponse[] {
    return usuarios.map((usuario) => this.toResponse(usuario));
  }
}
