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
import {
  Ausencia,
  EstadoAusencia,
} from '../ausencias/entities/ausencia.entity';

@Injectable()
export class AsignacionMesasService {
  constructor(
    @InjectRepository(AsignacionMesa)
    private readonly asignacionMesaRepository: Repository<AsignacionMesa>,

    @InjectRepository(Ausencia)
    private readonly ausenciaRepository: Repository<Ausencia>,
  ) {}

  async create(
    createAsignacionMesaDto: CreateAsignacionMesaDto,
  ): Promise<AsignacionMesa> {
    const { idUsuario, fecha } = createAsignacionMesaDto;

    const ausencia = await this.ausenciaRepository
      .createQueryBuilder('ausencia')
      .where('ausencia.idUsuario = :idUsuario', { idUsuario })
      .andWhere('ausencia.estado = :estado', {
        estado: EstadoAusencia.APROBADA,
      })
      .andWhere(':fecha BETWEEN ausencia.fechaInicio AND ausencia.fechaFin', {
        fecha,
      })
      .getOne();

    if (ausencia) {
      throw new BadRequestException(
        `No se puede asignar a este usuario: Tiene una ausencia aprobada (${ausencia.tipo}) desde el ${ausencia.fechaInicio} hasta el ${ausencia.fechaFin}.`,
      );
    }

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
