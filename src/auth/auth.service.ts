import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto, LoginResponseDto } from './dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { AuthAdapter } from './adapters/auth.adapter';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { email },
      select: [
        'id',
        'nombre',
        'apellidos',
        'email',
        'passwordHash',
        'idRol',
        'fotoUrl',
      ],
    });

    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = AuthAdapter.toPayload(usuario);

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: AuthAdapter.toLoginUserDto(usuario),
    };
  }
}
