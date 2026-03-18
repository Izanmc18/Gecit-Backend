/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const { passwordHash, ...restoDatos } = createUsuarioDto;

      const hashedPassword = await bcrypt.hash(passwordHash, 10);

      const usuario = this.usuarioRepository.create({
        ...restoDatos,
        passwordHash: hashedPassword,
      });

      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El email del usuario ya está en uso');
      }
      throw error;
    }
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({ relations: ['rol'] });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol'],
    });

    if (!usuario)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const datosActualizar = { ...updateUsuarioDto };

    if (updateUsuarioDto.passwordHash) {
      const hashedPassword = await bcrypt.hash(
        updateUsuarioDto.passwordHash,
        10,
      );
      datosActualizar.passwordHash = hashedPassword;
    }

    const usuario = await this.usuarioRepository.preload({
      id,
      ...datosActualizar,
    });

    if (!usuario)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);

    try {
      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El email del usuario ya está en uso');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
