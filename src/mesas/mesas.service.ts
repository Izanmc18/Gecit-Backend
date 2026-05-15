/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(idEntidad: string): Promise<Mesa[]> {
    return await this.mesaRepository.find({
      where: { sala: { idEntidad } },
      relations: ['sala'],
    });
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
    console.log('Update service call:', { id, updateMesaDto });
    const mesa = await this.findOne(id);
    if (!mesa) throw new NotFoundException(`Mesa con id ${id} no encontrada`);

    await this.mesaRepository.update(id, updateMesaDto);

    const updated = await this.findOne(id);
    console.log('Update result from DB:', {
      id,
      posX: updated.posX,
      posY: updated.posY,
    });
    return updated;
  }

  async remove(id: string): Promise<void> {
    const mesa = await this.findOne(id);

    try {
      await this.mesaRepository.remove(mesa);
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new BadRequestException(
          'No se puede eliminar esta mesa porque tiene citas o asignaciones de trabajadores vinculadas. Debes reasignar o eliminar esos registros primero.',
        );
      }
      throw error;
    }
  }
}
