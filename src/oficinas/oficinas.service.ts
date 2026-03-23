/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOficinaDto, UpdateOficinaDto } from './dto';
import { Oficina } from './entities';

@Injectable()
export class OficinasService {
  constructor(
    @InjectRepository(Oficina)
    private readonly oficinaRepository: Repository<Oficina>,
  ) {}

  async create(createOficinaDto: CreateOficinaDto): Promise<Oficina> {
    const oficina = this.oficinaRepository.create(createOficinaDto);
    return await this.oficinaRepository.save(oficina);
  }

  async findAll(): Promise<Oficina[]> {
    return await this.oficinaRepository.find();
  }

  async findOne(id: string): Promise<Oficina> {
    const oficina = await this.oficinaRepository.findOneBy({ id });
    if (!oficina)
      throw new NotFoundException(`Oficina con id ${id} no encontrada`);
    return oficina;
  }

  async update(
    id: string,
    updateOficinaDto: UpdateOficinaDto,
  ): Promise<Oficina> {
    const oficina = await this.oficinaRepository.preload({
      id,
      ...updateOficinaDto,
    });

    if (!oficina)
      throw new NotFoundException(`Oficina con id ${id} no encontrada`);

    return await this.oficinaRepository.save(oficina);
  }

  async remove(id: string): Promise<void> {
    const oficina = await this.findOne(id);

    try {
      await this.oficinaRepository.remove(oficina);
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new BadRequestException(
          'No se puede eliminar esta oficina porque tiene salas o festivos vinculados. Elimina primero esos registros dependientes.',
        );
      }
      throw error;
    }
  }
}
