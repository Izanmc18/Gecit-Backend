/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAsignacionMesaDto, UpdateAsignacionMesaDto } from './dto';
import { AsignacionMesa } from './entities/asignacion-mesa.entity';

@Injectable()
export class AsignacionMesasService {
  constructor(
    @InjectRepository(AsignacionMesa)
    private readonly asignacionMesaRepository: Repository<AsignacionMesa>,
  ) {}

  async create(
    createAsignacionMesaDto: CreateAsignacionMesaDto,
  ): Promise<AsignacionMesa> {
    try {
      const asignacion = this.asignacionMesaRepository.create(
        createAsignacionMesaDto,
      );
      return await this.asignacionMesaRepository.save(asignacion);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Ya existe una asignación para esta mesa en esa fecha y turno',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<AsignacionMesa[]> {
    return await this.asignacionMesaRepository.find({
      relations: ['usuario', 'mesa'],
    });
  }

  async findOne(id: string): Promise<AsignacionMesa> {
    const asignacion = await this.asignacionMesaRepository.findOne({
      where: { id },
      relations: ['usuario', 'mesa'],
    });

    if (!asignacion)
      throw new NotFoundException(
        `Asignación de mesa con id ${id} no encontrada`,
      );
    return asignacion;
  }

  async update(
    id: string,
    updateAsignacionMesaDto: UpdateAsignacionMesaDto,
  ): Promise<AsignacionMesa> {
    const asignacion = await this.asignacionMesaRepository.preload({
      id,
      ...updateAsignacionMesaDto,
    });

    if (!asignacion)
      throw new NotFoundException(
        `Asignación de mesa con id ${id} no encontrada`,
      );

    try {
      return await this.asignacionMesaRepository.save(asignacion);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Ya existe una asignación para esta mesa en esa fecha y turno',
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const asignacion = await this.findOne(id);
    await this.asignacionMesaRepository.remove(asignacion);
  }
}
