/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      const usuario = this.usuarioRepository.create(createUsuarioDto);
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
    const usuario = await this.usuarioRepository.preload({
      id,
      ...updateUsuarioDto,
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
