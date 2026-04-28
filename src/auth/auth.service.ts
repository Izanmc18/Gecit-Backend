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

  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const { password, ...userData } = registerDto;

    const usuario = this.usuarioRepository.create({
      ...userData,
      passwordHash: bcrypt.hashSync(password, 10),
      idRol: 'e51b3a32-3333-4a3b-9a99-b1d5c7f8a123', // Rol Cliente por defecto
    });

    try {
      await this.usuarioRepository.save(usuario);
      return this.login({ email: registerDto.email, password: registerDto.password });
    } catch (error) {
      throw new UnauthorizedException('Error al registrar usuario. Posible email duplicado.');
    }
  }
}
