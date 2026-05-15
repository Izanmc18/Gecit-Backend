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

import { Competencia } from '../competencias/entities/competencia.entity';
import { In } from 'typeorm';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { password, competenciasIds, ...userData } = createUsuarioDto;

    try {
      const usuario = this.usuarioRepository.create({
        ...userData,
        passwordHash: bcrypt.hashSync(password, 10),
        debeCambiarPassword: createUsuarioDto.debeCambiarPassword ?? false,
      });

      if (competenciasIds && competenciasIds.length > 0) {
        usuario.competencias = await this.competenciaRepository.findBy({ id: In(competenciasIds) });
      }

      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      throw new BadRequestException(
        'Check logs - duplicate email or invalid data',
      );
    }
  }

  async findAll(paginationDto: PaginationDto, idEntidad?: string): Promise<Usuario[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const whereClause: any = {};
    if (idEntidad) {
      whereClause.idEntidad = idEntidad;
    }
    
    return await this.usuarioRepository.find({
      where: whereClause,
      take: limit,
      skip: offset,
      relations: ['rol', 'entidad', 'competencias'],
    });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol', 'entidad', 'competencias'],
    });
    if (!usuario) throw new NotFoundException('User not found');
    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const { password, competenciasIds, ...updateData } = updateUsuarioDto;

    const usuario = await this.usuarioRepository.preload({
      id,
      ...updateData,
    });

    if (!usuario) throw new NotFoundException('User not found');

    if (password) {
      usuario.passwordHash = bcrypt.hashSync(password, 10);
    }

    if (competenciasIds !== undefined) {
      if (competenciasIds.length > 0) {
        usuario.competencias = await this.competenciaRepository.findBy({ id: In(competenciasIds) });
      } else {
        usuario.competencias = [];
      }
    }

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
