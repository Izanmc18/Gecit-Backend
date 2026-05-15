import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntidadDto, UpdateEntidadDto } from './dto';
import { Entidad } from './entities/entidad.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Tramite } from '../tramites/entities/tramite.entity';
import { Competencia } from '../competencias/entities/competencia.entity';

@Injectable()
export class EntidadesService {
  constructor(
    @InjectRepository(Entidad)
    private readonly entidadRepository: Repository<Entidad>,
    @InjectRepository(Tramite)
    private readonly tramiteRepository: Repository<Tramite>,
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,
  ) {}

  async create(createEntidadDto: CreateEntidadDto): Promise<Entidad> {
    const { tramites, ...entidadData } = createEntidadDto;
    const entidad = this.entidadRepository.create(entidadData);
    const savedEntidad = await this.entidadRepository.save(entidad);

    if (tramites && tramites.length > 0) {
      for (const nombreTramite of tramites) {
        if (!nombreTramite.trim()) continue;
        const competencia = this.competenciaRepository.create({
          nombreCompetencia: nombreTramite.trim(),
          idEntidad: savedEntidad.id,
        });
        const savedCompetencia = await this.competenciaRepository.save(competencia);
        const tramite = this.tramiteRepository.create({
          nombreTramite: nombreTramite.trim(),
          idEntidad: savedEntidad.id,
          idCompetenciaRequerida: savedCompetencia.id,
        });
        await this.tramiteRepository.save(tramite);
      }
    }

    return savedEntidad;
  }

  async findAll(paginationDto: PaginationDto): Promise<Entidad[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.entidadRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string): Promise<Entidad> {
    const entidad = await this.entidadRepository.findOneBy({ id });
    if (!entidad) {
      throw new NotFoundException(`Entidad con id ${id} no encontrada`);
    }
    return entidad;
  }

  async findByDomain(dominio: string): Promise<Entidad> {
    const entidad = await this.entidadRepository.findOne({
      where: { dominio, activo: true },
    });
    if (!entidad) {
      throw new NotFoundException(
        `Entidad con dominio ${dominio} no encontrada o inactiva`,
      );
    }
    return entidad;
  }

  async update(
    id: string,
    updateEntidadDto: UpdateEntidadDto,
  ): Promise<Entidad> {
    const { tramites, ...entidadData } = updateEntidadDto;
    const entidad = await this.entidadRepository.preload({
      id,
      ...entidadData,
    });
    if (!entidad) {
      throw new NotFoundException(`Entidad con id ${id} no encontrada`);
    }
    return await this.entidadRepository.save(entidad);
  }

  async remove(id: string): Promise<void> {
    const entidad = await this.findOne(id);
    await this.entidadRepository.remove(entidad);
  }
}
