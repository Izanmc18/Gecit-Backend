export class LoginUserDto {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  idRol: string;
  idEntidad: string;
  fotoUrl: string | null;
}

export class LoginResponseDto {
  token: string;
  user: LoginUserDto;
}
