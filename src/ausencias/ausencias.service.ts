import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAusenciaDto, UpdateAusenciaDto } from './dto';
import { Ausencia } from './entities/ausencia.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AusenciasService {
  constructor(
    @InjectRepository(Ausencia)
    private readonly ausenciaRepository: Repository<Ausencia>,
  ) {}

  async create(createAusenciaDto: CreateAusenciaDto): Promise<Ausencia> {
    const ausencia = this.ausenciaRepository.create(createAusenciaDto);
    return await this.ausenciaRepository.save(ausencia);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const queryBuilder = this.ausenciaRepository
      .createQueryBuilder('ausencia')
      .leftJoinAndSelect('ausencia.usuario', 'usuario')
      .take(limit)
      .skip(offset)
      .orderBy('ausencia.fechaSolicitud', 'DESC');

    const [ausencias, total] = await queryBuilder.getManyAndCount();

    return {
      data: ausencias,
      meta: {
        total,
        limit,
        offset,
      },
    };
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
}
