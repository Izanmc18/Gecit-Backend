import { Usuario } from '../../usuarios/entities/usuario.entity';
import { LoginUserDto } from '../dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export class AuthAdapter {
  static toPayload(usuario: Usuario): JwtPayload {
    return {
      sub: usuario.id,
      email: usuario.email,
      idRol: usuario.idRol,
    };
  }

  static toLoginUserDto(usuario: Usuario): LoginUserDto {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      idRol: usuario.idRol,
      fotoUrl: usuario.fotoUrl || null,
    };
  }
}
