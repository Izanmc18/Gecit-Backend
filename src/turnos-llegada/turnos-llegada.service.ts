import {
  Injectable,
  NotFoundException,
  BadRequestException,
  MessageEvent,
} from '@nestjs/common';
import { Subject } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TurnoLlegada, EstadoTurno } from './entities/turno-llegada.entity';
import {
  CreateTurnoLlegadaDto,
  UpdateTurnoLlegadaDto,
  CheckinDto,
} from './dto';
import { Cita } from '../citas/entities/cita.entity';
import { AsignacionMesa } from '../asignacion-mesas/entities/asignacion-mesa.entity';

import { Entidad } from '../entidades/entities/entidad.entity';
import { EntidadesService } from '../entidades/entidades.service';

@Injectable()
export class TurnosLlegadaService {
  constructor(
    @InjectRepository(TurnoLlegada)
    private readonly turnoRepository: Repository<TurnoLlegada>,

    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(AsignacionMesa)
    private readonly asignacionRepository: Repository<AsignacionMesa>,

    @InjectRepository(Entidad)
    private readonly entidadRepository: Repository<Entidad>,
  ) {}

  private readonly eventsSubject = new Subject<MessageEvent>();

  getEventsObservable() {
    return this.eventsSubject.asObservable();
  }

  private async emitUpdate(idEntidad: string, type: string) {

    const entidad = await this.entidadRepository.findOne({ where: { id: idEntidad } });
    const slugEntidad = entidad?.dominio || idEntidad;

    this.eventsSubject.next({
      data: { idEntidad, slugEntidad, type, timestamp: new Date().toISOString() },
    } as MessageEvent);
  }

  async create(createDto: CreateTurnoLlegadaDto): Promise<TurnoLlegada> {
    const ticketCode =
      createDto.codigoTicket ||
      Math.random().toString(36).substring(2, 6).toUpperCase();
    const dtoToCreate = { ...createDto, codigoTicket: ticketCode };
    const turno = this.turnoRepository.create(dtoToCreate);
    const saved = await this.turnoRepository.save(turno);
    this.emitUpdate(saved.idEntidad, 'create');
    return saved;
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

  async llamarTurno(id: string, idUsuario: string): Promise<TurnoLlegada> {
    const turno = await this.findOne(id);
    if (turno.estado !== EstadoTurno.EN_ESPERA) {
      throw new BadRequestException(
        `El ticket ya está en estado "${turno.estado}" y no puede ser llamado`,
      );
    }

    const hoy = new Date().toISOString().split('T')[0];
    const asignacion = await this.asignacionRepository.findOne({
      where: { idUsuario, fecha: hoy }
    });

    if (asignacion && turno.idCita) {
     
      await this.citaRepository.update(turno.idCita, { 
        idMesa: asignacion.idMesa,
        idUsuarioAsignado: idUsuario
      });
    } else if (turno.idCita) {

      await this.citaRepository.update(turno.idCita, { idUsuarioAsignado: idUsuario });
    }

    turno.estado = EstadoTurno.LLAMADO;
    turno.fechaLlamada = new Date();
    const saved = await this.turnoRepository.save(turno);
    this.emitUpdate(saved.idEntidad, 'call');
    return saved;
  }

  async atenderTurno(id: string): Promise<TurnoLlegada> {
    const turno = await this.findOne(id);
    if (turno.estado !== EstadoTurno.LLAMADO) {
      throw new BadRequestException(
        `El ticket debe estar en estado "Llamado" para poder atenderse`,
      );
    }
    turno.estado = EstadoTurno.ATENDIDO;

    if (turno.idCita) {
      await this.citaRepository.update(turno.idCita, { estado: 'Realizada' as any });
    }
    
    const saved = await this.turnoRepository.save(turno);
    this.emitUpdate(saved.idEntidad, 'attend');
    return saved;
  }

  async descartarTurno(id: string): Promise<TurnoLlegada> {
    const turno = await this.findOne(id);
    turno.estado = EstadoTurno.DESCARTADO;

    if (turno.idCita) {
      await this.citaRepository.update(turno.idCita, { estado: 'No presentado' as any });
    }
    
    const saved = await this.turnoRepository.save(turno);
    this.emitUpdate(saved.idEntidad, 'discard');
    return saved;
  }

  async handleCheckin(checkinDto: CheckinDto) {
    const hoy = new Date().toISOString().split('T')[0];
    const cita = await this.citaRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.turnoLlegada', 'turnoLlegada')
      .leftJoinAndSelect('cita.mesa', 'mesa')
      .leftJoinAndSelect('cita.sala', 'sala')
      .where('cita.idEntidad = :idEntidad', { idEntidad: checkinDto.idEntidad })
      .andWhere('cita.clienteDni = :dni', { dni: checkinDto.dni })
      .andWhere('DATE(cita.fechaHora) = :hoy', { hoy })
      .andWhere('cita.estado = :estado', { estado: 'Pendiente' })
      .getOne();

    if (!cita) {
      throw new NotFoundException(
        'No se encontró una cita pendiente para hoy con ese DNI',
      );
    }

    if (cita.turnoLlegada) {
      return {
        ticket: cita.turnoLlegada.codigoTicket,
        idCita: cita.id,
        mensaje: 'Ya tienes un ticket generado',
      };
    }

    const countHoy = await this.turnoRepository
      .createQueryBuilder('turno')
      .where('turno.idEntidad = :idEntidad', {
        idEntidad: checkinDto.idEntidad,
      })
      .andWhere('DATE(turno.fechaGeneracion) = :hoy', { hoy })
      .getCount();

    const ticketCode = `A-${(countHoy + 1).toString().padStart(3, '0')}`;

    const turno = this.turnoRepository.create({
      idEntidad: checkinDto.idEntidad,
      idCita: cita.id,
      codigoTicket: ticketCode,
      estado: EstadoTurno.EN_ESPERA,
    });

    await this.turnoRepository.save(turno);
    this.emitUpdate(checkinDto.idEntidad, 'checkin');
    return { ticket: ticketCode, idCita: cita.id };
  }

  async getDisplayData(idEntidad?: string, slug?: string) {
    let targetId = idEntidad;
    if (!targetId && slug) {
      const entidad = await this.entidadRepository.findOne({ where: { dominio: slug } });
      if (!entidad) throw new NotFoundException(`Entidad con slug ${slug} no encontrada`);
      targetId = entidad.id;
    }

    if (!targetId) throw new BadRequestException('Debe proporcionar idEntidad o slug');

    const hoy = new Date().toISOString().split('T')[0];

    const llamados = await this.turnoRepository
      .createQueryBuilder('turno')
      .leftJoinAndSelect('turno.cita', 'cita')
      .leftJoinAndSelect('cita.mesa', 'mesa')
      .leftJoinAndSelect('mesa.sala', 'sala')
      .where('turno.idEntidad = :targetId', { targetId })
      .andWhere('turno.estado = :estado', { estado: EstadoTurno.LLAMADO })
      .andWhere('DATE(turno.fechaGeneracion) = :hoy', { hoy })
      .orderBy('turno.fechaLlamada', 'DESC')
      .getMany();

    const enEspera = await this.turnoRepository
      .createQueryBuilder('turno')
      .where('turno.idEntidad = :targetId', { targetId })
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
