import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCitaDto, UpdateCitaDto } from './dto';
import { Cita } from './entities/cita.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const cita = this.citaRepository.create(createCitaDto);
    return await this.citaRepository.save(cita);
  }

  async findAll(): Promise<Cita[]> {
    return await this.citaRepository.find({
      relations: ['usuarioAsignado', 'mesa', 'tramite'],
    });
  }

  async findOne(id: string): Promise<Cita> {
    const cita = await this.citaRepository.findOne({
      where: { id },
      relations: ['usuarioAsignado', 'mesa', 'tramite'],
    });

    if (!cita) throw new NotFoundException(`Cita con id ${id} no encontrada`);
    return cita;
  }

  async update(id: string, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.citaRepository.preload({
      id,
      ...updateCitaDto,
    });

    if (!cita) throw new NotFoundException(`Cita con id ${id} no encontrada`);

    return await this.citaRepository.save(cita);
  }

  async remove(id: string): Promise<void> {
    const cita = await this.findOne(id);
    await this.citaRepository.remove(cita);
  }
}
