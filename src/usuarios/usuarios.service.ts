/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { Usuario } from './entities/usuario.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { password, ...userData } = createUsuarioDto;

    try {
      const usuario = this.usuarioRepository.create({
        ...userData,
        passwordHash: bcrypt.hashSync(password, 10),
      });
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      throw new BadRequestException(
        'Check logs - duplicate email or invalid data',
      );
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Usuario[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.usuarioRepository.find({
      take: limit,
      skip: offset,
      relations: ['rol', 'entidad'],
    });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol', 'entidad'],
    });
    if (!usuario) throw new NotFoundException('User not found');
    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const { password, ...updateData } = updateUsuarioDto;

    const usuario = await this.usuarioRepository.preload({
      id,
      ...updateData,
    });

    if (!usuario) throw new NotFoundException('User not found');

    if (password) {
      usuario.passwordHash = bcrypt.hashSync(password, 10);
    }

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
