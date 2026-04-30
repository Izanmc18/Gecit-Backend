/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAusenciaDto, UpdateAusenciaDto, FilterAusenciaDto } from './dto';
import { Ausencia, TipoAusencia } from './entities/ausencia.entity';
import { EstadoAusencia } from './dto/filter-ausencia.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AusenciasService {
  constructor(
    @InjectRepository(Ausencia)
    private readonly ausenciaRepository: Repository<Ausencia>,
  ) {}

  async create(createAusenciaDto: CreateAusenciaDto): Promise<Ausencia> {
    if (createAusenciaDto.tipo === TipoAusencia.VACACIONES) {
      const inicio = new Date(createAusenciaDto.fechaInicio);
      const hoy = new Date();
      const diffTime = Math.abs(inicio.getTime() - hoy.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 14) {
        throw new BadRequestException(
          'Las vacaciones deben solicitarse con al menos 14 días de antelación',
        );
      }
    }
    const ausencia = this.ausenciaRepository.create(createAusenciaDto);
    return await this.ausenciaRepository.save(ausencia);
  }

  async findAll(filterDto: FilterAusenciaDto) {
    const {
      limit = 10,
      offset = 0,
      search,
      idUsuario,
      idEntidad,
      estado,
    } = filterDto;

    const queryBuilder = this.ausenciaRepository
      .createQueryBuilder('ausencia')
      .leftJoinAndSelect('ausencia.usuario', 'usuario')
      .take(limit)
      .skip(offset)
      .orderBy('ausencia.fechaSolicitud', 'DESC');

    if (idUsuario) {
      queryBuilder.andWhere('ausencia.idUsuario = :idUsuario', { idUsuario });
    }
    if (idEntidad) {
      queryBuilder.andWhere('usuario.idEntidad = :idEntidad', { idEntidad });
    }
    if (estado) {
      queryBuilder.andWhere('ausencia.estado = :estado', { estado });
    }

    try {
      const [ausencias, total] = await queryBuilder.getManyAndCount();

      return {
        data: ausencias,
        meta: {
          total,
          limit,
          offset,
        },
      };
    } catch (error) {
      console.error('Error en AusenciasService.findAll:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Ausencia> {
    const ausencia = await this.ausenciaRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!ausencia)
      throw new NotFoundException(`Ausencia con id ${id} no encontrada`);
    return ausencia;
  }

  async update(
    id: string,
    updateAusenciaDto: UpdateAusenciaDto,
  ): Promise<Ausencia> {
    const ausencia = await this.ausenciaRepository.preload({
      id,
      ...updateAusenciaDto,
    });

    if (!ausencia)
      throw new NotFoundException(`Ausencia con id ${id} no encontrada`);

    return await this.ausenciaRepository.save(ausencia);
  }

  async remove(id: string): Promise<void> {
    const ausencia = await this.findOne(id);
    await this.ausenciaRepository.remove(ausencia);
  }

  async approve(id: string): Promise<Ausencia> {
    const ausencia = await this.findOne(id);
    ausencia.estado = EstadoAusencia.APROBADA;
    return await this.ausenciaRepository.save(ausencia);
  }

  async reject(id: string): Promise<Ausencia> {
    const ausencia = await this.findOne(id);
    ausencia.estado = EstadoAusencia.RECHAZADA;
    return await this.ausenciaRepository.save(ausencia);
  }
}
