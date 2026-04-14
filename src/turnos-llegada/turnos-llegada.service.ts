import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TurnoLlegada, EstadoTurno } from './entities/turno-llegada.entity';
import {
  CreateTurnoLlegadaDto,
  UpdateTurnoLlegadaDto,
  CheckinDto,
} from './dto';
import { Cita } from '../citas/entities/cita.entity';

@Injectable()
export class TurnosLlegadaService {
  constructor(
    @InjectRepository(TurnoLlegada)
    private readonly turnoRepository: Repository<TurnoLlegada>,

    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  async create(createDto: CreateTurnoLlegadaDto): Promise<TurnoLlegada> {
    const ticketCode =
      createDto.codigoTicket ||
      Math.random().toString(36).substring(2, 6).toUpperCase();
    const dtoToCreate = { ...createDto, codigoTicket: ticketCode };
    const turno = this.turnoRepository.create(dtoToCreate);
    return await this.turnoRepository.save(turno);
  }

  async findAll(): Promise<TurnoLlegada[]> {
    return await this.turnoRepository.find({
      relations: ['entidad', 'cita'],
      order: { fechaGeneracion: 'DESC' },
    });
  }

  async findByEntidad(idEntidad: string): Promise<TurnoLlegada[]> {
    return await this.turnoRepository.find({
      where: { idEntidad },
      order: { fechaGeneracion: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TurnoLlegada> {
    const turno = await this.turnoRepository.findOne({
      where: { id },
      relations: ['entidad', 'cita'],
    });
    if (!turno)
      throw new NotFoundException(`Ticket con id ${id} no encontrado`);
    return turno;
  }

  async update(
    id: string,
    updateDto: UpdateTurnoLlegadaDto,
  ): Promise<TurnoLlegada> {
    const turno = await this.turnoRepository.preload({ id, ...updateDto });
    if (!turno)
      throw new NotFoundException(`Ticket con id ${id} no encontrado`);
    return await this.turnoRepository.save(turno);
  }

  async remove(id: string): Promise<void> {
    const turno = await this.findOne(id);
    await this.turnoRepository.remove(turno);
  }

  async llamarTurno(id: string): Promise<TurnoLlegada> {
    const turno = await this.findOne(id);
    if (turno.estado !== EstadoTurno.EN_ESPERA) {
      throw new BadRequestException(
        `El ticket ya está en estado "${turno.estado}" y no puede ser llamado`,
      );
    }
    turno.estado = EstadoTurno.LLAMADO;
    turno.fechaLlamada = new Date();
    return await this.turnoRepository.save(turno);
  }

  async atenderTurno(id: string): Promise<TurnoLlegada> {
    const turno = await this.findOne(id);
    if (turno.estado !== EstadoTurno.LLAMADO) {
      throw new BadRequestException(
        `El ticket debe estar en estado "Llamado" para poder atenderse`,
      );
    }
    turno.estado = EstadoTurno.ATENDIDO;
    return await this.turnoRepository.save(turno);
  }

  async descartarTurno(id: string): Promise<TurnoLlegada> {
    const turno = await this.findOne(id);
    turno.estado = EstadoTurno.DESCARTADO;
    return await this.turnoRepository.save(turno);
  }

  async handleCheckin(checkinDto: CheckinDto) {
    const hoy = new Date().toISOString().split('T')[0];
    const cita = await this.citaRepository
      .createQueryBuilder('cita')
      .innerJoin('cita.mesa', 'mesa')
      .innerJoin('mesa.sala', 'sala')
      .where('sala.idEntidad = :idEntidad', { idEntidad: checkinDto.idEntidad })
      .andWhere('cita.clienteDni = :dni', { dni: checkinDto.dni })
      .andWhere('DATE(cita.fechaHora) = :hoy', { hoy })
      .getOne();

    if (!cita) {
      throw new NotFoundException(
        'No se encontró una cita válida para hoy con ese DNI',
      );
    }

    const ticketCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const turno = this.turnoRepository.create({
      idEntidad: checkinDto.idEntidad,
      idCita: cita.id,
      codigoTicket: ticketCode,
      estado: EstadoTurno.EN_ESPERA,
    });

    await this.turnoRepository.save(turno);
    return { ticket: ticketCode, idCita: cita.id };
  }

  async getDisplayData(idEntidad: string) {
    const hoy = new Date().toISOString().split('T')[0];

    const llamados = await this.turnoRepository
      .createQueryBuilder('turno')
      .leftJoinAndSelect('turno.cita', 'cita')
      .leftJoinAndSelect('cita.mesa', 'mesa')
      .leftJoinAndSelect('mesa.sala', 'sala')
      .where('turno.idEntidad = :idEntidad', { idEntidad })
      .andWhere('turno.estado = :estado', { estado: EstadoTurno.LLAMADO })
      .andWhere('DATE(turno.fechaGeneracion) = :hoy', { hoy })
      .orderBy('turno.fechaLlamada', 'DESC')
      .getMany();

    const enEspera = await this.turnoRepository
      .createQueryBuilder('turno')
      .where('turno.idEntidad = :idEntidad', { idEntidad })
      .andWhere('turno.estado = :estado', { estado: EstadoTurno.EN_ESPERA })
      .andWhere('DATE(turno.fechaGeneracion) = :hoy', { hoy })
      .orderBy('turno.fechaGeneracion', 'ASC')
      .getMany();

    return {
      llamados: llamados.map((t) => ({
        ticket: t.codigoTicket,
        mesa: t.cita?.mesa?.nombreMesa || 'N/A',
        sala: t.cita?.mesa?.sala?.nombreSala || 'N/A',
      })),
      enEspera: enEspera.map((t) => ({
        ticket: t.codigoTicket,
      })),
    };
  }
}
