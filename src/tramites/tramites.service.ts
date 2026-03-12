import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tramite } from './entities/tramite.entity';
import { CreateTramiteDto, UpdateTramiteDto } from './dto';

@Injectable()
export class TramitesService {
  constructor(
    @InjectRepository(Tramite)
    private readonly tramiteRepository: Repository<Tramite>,
  ) {}

  async create(createTramiteDto: CreateTramiteDto) {
    try {
      const tramite = this.tramiteRepository.create(createTramiteDto);
      await this.tramiteRepository.save(tramite);
      return tramite;
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El trámite ya existe');
      }
      throw error;
    }
  }

  async findAll() {
    return this.tramiteRepository.find();
  }

  async findOne(id: string) {
    const tramite = await this.tramiteRepository.findOneBy({ id });
    if (!tramite) {
      throw new NotFoundException(`Trámite con id ${id} no encontrado`);
    }
    return tramite;
  }

  async update(id: string, updateTramiteDto: UpdateTramiteDto) {
    const tramite = await this.findOne(id);
    Object.assign(tramite, updateTramiteDto);

    try {
      await this.tramiteRepository.save(tramite);
      return tramite;
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El nombre del trámite ya está en uso');
      }
      throw error;
    }
  }

  async remove(id: string) {
    const tramite = await this.findOne(id);
    await this.tramiteRepository.remove(tramite);
    return {
      message: `Trámite con id ${id} eliminado exitosamente`,
    };
  }
}
