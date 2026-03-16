import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFestivoDto, UpdateFestivoDto } from './dto';
import { Festivo } from './entities/festivo.entity';

@Injectable()
export class FestivosService {
  constructor(
    @InjectRepository(Festivo)
    private readonly festivoRepository: Repository<Festivo>,
  ) {}

  async create(createFestivoDto: CreateFestivoDto): Promise<Festivo> {
    const festivo = this.festivoRepository.create(createFestivoDto);
    return await this.festivoRepository.save(festivo);
  }

  async findAll(): Promise<Festivo[]> {
    return await this.festivoRepository.find({ relations: ['oficina'] });
  }

  async findOne(id: string): Promise<Festivo> {
    const festivo = await this.festivoRepository.findOne({
      where: { id },
      relations: ['oficina'],
    });

    if (!festivo)
      throw new NotFoundException(`Festivo con id ${id} no encontrado`);
    return festivo;
  }

  async update(
    id: string,
    updateFestivoDto: UpdateFestivoDto,
  ): Promise<Festivo> {
    const festivo = await this.festivoRepository.preload({
      id,
      ...updateFestivoDto,
    });

    if (!festivo)
      throw new NotFoundException(`Festivo con id ${id} no encontrado`);

    return await this.festivoRepository.save(festivo);
  }

  async remove(id: string): Promise<void> {
    const festivo = await this.findOne(id);
    await this.festivoRepository.remove(festivo);
  }
}
