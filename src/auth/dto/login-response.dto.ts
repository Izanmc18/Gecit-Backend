export class LoginUserDto {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  idRol: string;
  fotoUrl: string | null;
}

export class LoginResponseDto {
  accessToken: string;
  usuario: LoginUserDto;
}
