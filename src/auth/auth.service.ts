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
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email },
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

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!(await bcrypt.compare(loginDto.password, usuario.passwordHash))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = AuthAdapter.toPayload(usuario);

    return {
      token: this.jwtService.sign(payload),
      user: AuthAdapter.toLoginUserDto(usuario),
    };
  }
}
