import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { JwtPayload } from '../interfaces/jwt-payload.en.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });
  }

  async validate(payload: JwtPayload): Promise<Usuario> {
    const { sub } = payload;

    const usuario = await this.usuarioRepository.findOne({
      where: { id: sub },
    });

    if (!usuario) {
      throw new UnauthorizedException('Token inválido');
    }

    return usuario;
  }
}
