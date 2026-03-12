import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOficinaDto, UpdateOficinaDto } from './dto';
import { Oficina } from './entities';
import { OficinaAdapter, OficinaResponse } from './adapters';

@Injectable()
export class OficinasService {
  constructor(
    @InjectRepository(Oficina)
    private readonly oficinaRepository: Repository<Oficina>,
  ) {}

  async create(createOficinaDto: CreateOficinaDto): Promise<OficinaResponse> {
    const oficina = this.oficinaRepository.create(createOficinaDto);
    await this.oficinaRepository.save(oficina);
    return OficinaAdapter.toResponse(oficina);
  }

  async findAll(): Promise<OficinaResponse[]> {
    const oficinas = await this.oficinaRepository.find();
    return OficinaAdapter.toResponseList(oficinas);
  }

  async findOne(id: string): Promise<OficinaResponse> {
    const oficina = await this.oficinaRepository.findOneBy({ id });
    if (!oficina)
      throw new NotFoundException(`Oficina con id ${id} no encontrada`);
    return OficinaAdapter.toResponse(oficina);
  }

  async update(
    id: string,
    updateOficinaDto: UpdateOficinaDto,
  ): Promise<OficinaResponse> {
    const oficina = await this.oficinaRepository.preload({
      id,
      ...updateOficinaDto,
    });

    if (!oficina)
      throw new NotFoundException(`Oficina con id ${id} no encontrada`);

    await this.oficinaRepository.save(oficina);
    return OficinaAdapter.toResponse(oficina);
  }

  async remove(id: string): Promise<void> {
    const oficina = await this.oficinaRepository.findOneBy({ id });
    if (!oficina)
      throw new NotFoundException(`Oficina con id ${id} no encontrada`);
    await this.oficinaRepository.remove(oficina);
  }
}
