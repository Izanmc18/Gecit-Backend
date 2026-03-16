import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAusenciaDto, UpdateAusenciaDto } from './dto';
import { Ausencia } from './entities/ausencia.entity';

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

  async findAll(): Promise<Ausencia[]> {
    return await this.ausenciaRepository.find({ relations: ['usuario'] });
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
