import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHorarioDto, UpdateHorarioDto } from './dto';
import { Horario } from './entities/horario.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
  ) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    const horario = this.horarioRepository.create(createHorarioDto);
    return await this.horarioRepository.save(horario);
  }

  async findAll(): Promise<Horario[]> {
    return await this.horarioRepository.find({ relations: ['oficina'] });
  }

  async findOne(id: string): Promise<Horario> {
    const horario = await this.horarioRepository.findOne({
      where: { id },
      relations: ['oficina'],
    });

    if (!horario)
      throw new NotFoundException(`Horario con id ${id} no encontrado`);
    return horario;
  }

  async update(
    id: string,
    updateHorarioDto: UpdateHorarioDto,
  ): Promise<Horario> {
    const horario = await this.horarioRepository.preload({
      id,
      ...updateHorarioDto,
    });

    if (!horario)
      throw new NotFoundException(`Horario con id ${id} no encontrado`);

    return await this.horarioRepository.save(horario);
  }

  async remove(id: string): Promise<void> {
    const horario = await this.findOne(id);
    await this.horarioRepository.remove(horario);
  }
}
