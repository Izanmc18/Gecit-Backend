import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntidadDto, UpdateEntidadDto } from './dto';
import { Entidad } from './entities/entidad.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class EntidadesService {
  constructor(
    @InjectRepository(Entidad)
    private readonly entidadRepository: Repository<Entidad>,
  ) {}

  async create(createEntidadDto: CreateEntidadDto): Promise<Entidad> {
    const entidad = this.entidadRepository.create(createEntidadDto);
    return await this.entidadRepository.save(entidad);
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

  async update(
    id: string,
    updateEntidadDto: UpdateEntidadDto,
  ): Promise<Entidad> {
    const entidad = await this.entidadRepository.preload({
      id,
      ...updateEntidadDto,
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
