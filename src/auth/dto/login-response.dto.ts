export class LoginUserDto {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  idRol: string;
  idEntidad: string;
  fotoUrl: string | null;
  dni?: string;
  telefono?: string;
}

export class LoginResponseDto {
  token: string;
  user: LoginUserDto;
  requirePasswordChange?: boolean;
}
