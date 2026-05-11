/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSalaDto, UpdateSalaDto } from './dto';
import { Sala } from './entities/sala.entity';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
  ) {}

  async create(createSalaDto: CreateSalaDto): Promise<Sala> {
    const sala = this.salaRepository.create(createSalaDto);
    return await this.salaRepository.save(sala);
  }

  async findAll(idEntidad: string): Promise<Sala[]> {
    return await this.salaRepository.find({
      where: { idEntidad },
      relations: ['entidad'],
    });
  }

  async findOne(id: string): Promise<Sala> {
    const sala = await this.salaRepository.findOne({
      where: { id },
      relations: ['oficina'],
    });

    if (!sala) throw new NotFoundException(`Sala con id ${id} no encontrada`);
    return sala;
  }

  async update(id: string, updateSalaDto: UpdateSalaDto): Promise<Sala> {
    const sala = await this.salaRepository.preload({
      id,
      ...updateSalaDto,
    });

    if (!sala) throw new NotFoundException(`Sala con id ${id} no encontrada`);

    return await this.salaRepository.save(sala);
  }

  async remove(id: string): Promise<void> {
    const sala = await this.findOne(id);

    try {
      await this.salaRepository.remove(sala);
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new BadRequestException(
          'No se puede eliminar esta sala porque tiene mesas vinculadas a ella. Elimina o mueve las mesas primero.',
        );
      }
      throw error;
    }
  }
}
