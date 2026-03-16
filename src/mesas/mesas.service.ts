import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMesaDto, UpdateMesaDto } from './dto';
import { Mesa } from './entities/mesa.entity';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  async create(createMesaDto: CreateMesaDto): Promise<Mesa> {
    const mesa = this.mesaRepository.create(createMesaDto);
    return await this.mesaRepository.save(mesa);
  }

  async findAll(): Promise<Mesa[]> {
    return await this.mesaRepository.find({ relations: ['sala'] });
  }

  async findOne(id: string): Promise<Mesa> {
    const mesa = await this.mesaRepository.findOne({
      where: { id },
      relations: ['sala'],
    });

    if (!mesa) throw new NotFoundException(`Mesa con id ${id} no encontrada`);
    return mesa;
  }

  async update(id: string, updateMesaDto: UpdateMesaDto): Promise<Mesa> {
    const mesa = await this.mesaRepository.preload({
      id,
      ...updateMesaDto,
    });

    if (!mesa) throw new NotFoundException(`Mesa con id ${id} no encontrada`);

    return await this.mesaRepository.save(mesa);
  }

  async remove(id: string): Promise<void> {
    const mesa = await this.findOne(id);
    await this.mesaRepository.remove(mesa);
  }
}
