/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCitaDto,
  UpdateCitaDto,
  FilterCitaDto,
  SlotsFilterDto,
  ReasignarMasivoDto,
} from './dto';
import { Tramite } from 'src/tramites/entities/tramite.entity';
import { Sala } from 'src/salas/entities/sala.entity';
import { Cita, EstadoCita } from './entities/cita.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Mesa } from 'src/mesas/entities/mesa.entity';
import { Festivo } from 'src/festivos/entities/festivo.entity';
import { Entidad } from 'src/entidades/entities/entidad.entity';
import { Horario } from 'src/horarios/entities/horario.entity';
import { Ausencia } from 'src/ausencias/entities/ausencia.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

import { AsignacionMesa } from 'src/asignacion-mesas/entities/asignacion-mesa.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,

    @InjectRepository(Festivo)
    private readonly festivoRepository: Repository<Festivo>,

    @InjectRepository(Entidad)
    private readonly entidadRepository: Repository<Entidad>,

    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,

    @InjectRepository(Ausencia)
    private readonly ausenciaRepository: Repository<Ausencia>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Tramite)
    private readonly tramiteRepository: Repository<Tramite>,

    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,

    @InjectRepository(AsignacionMesa)
    private readonly asignacionMesaRepository: Repository<AsignacionMesa>,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    let idEntidad: string;

    if (createCitaDto.idMesa) {
      const mesa = await this.mesaRepository.findOne({
        where: { id: createCitaDto.idMesa },
        relations: ['sala'],
      });
      if (!mesa) throw new NotFoundException(`Mesa con id ${createCitaDto.idMesa} no encontrada`);
      idEntidad = mesa.sala.idEntidad;
    } else if (createCitaDto.idSala) {
      const sala = await this.salaRepository.findOne({
        where: { id: createCitaDto.idSala }
      });
      if (!sala) throw new NotFoundException(`Sala con id ${createCitaDto.idSala} no encontrada`);
      idEntidad = sala.idEntidad;
    } else {
      throw new BadRequestException('Debe proporcionar idMesa o idSala para crear la cita');
    }

    const fechaCita = new Date(createCitaDto.fechaHora);
    const fechaCitaString = fechaCita.toISOString().split('T')[0];

    const esFestivo = await this.festivoRepository.findOne({
      where: {
        idEntidad: idEntidad,
        fecha: fechaCitaString,
      },
    });

    if (esFestivo) {
      throw new BadRequestException(
        `No se puede crear la cita: El día ${fechaCitaString} es festivo en esta entidad (${esFestivo.descripcion || 'Festivo local'}).`,
      );
    }

    if (createCitaDto.idMesa) {
      const citaOcupada = await this.citaRepository.findOne({
        where: {
          idMesa: createCitaDto.idMesa,
          fechaHora: fechaCita,
        },
      });

      if (citaOcupada) {
        throw new BadRequestException(
          'Esta mesa ya tiene una cita reservada para esa hora exacta.',
        );
      }
    }

    const cita = this.citaRepository.create({
      ...createCitaDto,
      idEntidad,
    });
    return await this.citaRepository.save(cita);
  }

  async findAll(filterDto: FilterCitaDto, forcedIdEntidad?: string) {
    const {
      limit = 10,
      offset = 0,
      search,
      idUsuarioAsignado,
      idCliente,
      estado,
      fechaInicio,
      fechaFin,
    } = filterDto;

    const queryBuilder = this.citaRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.usuarioAsignado', 'usuarioAsignado')
      .leftJoinAndSelect('cita.mesa', 'mesa')
      .leftJoinAndSelect('mesa.sala', 'sala')
      .leftJoinAndSelect('cita.sala', 'salaDirecta')
      .leftJoinAndSelect('cita.tramite', 'tramite')
      .leftJoinAndSelect('cita.turnoLlegada', 'turnoLlegada')
      .take(limit)
      .skip(offset)
      .orderBy('cita.fechaHora', 'ASC');

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(cita.clienteNombre) LIKE LOWER(:search) OR LOWER(cita.clienteApellidos) LIKE LOWER(:search) OR LOWER(cita.clienteDni) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    if (idUsuarioAsignado) {
      if (filterDto.includeUnassigned === 'true') {
        const usuario = await this.usuarioRepository.findOne({ where: { id: idUsuarioAsignado }, relations: ['competencias'] });
        const idsCompetencias = usuario?.competencias?.map(c => c.id) || [];
        
        if (idsCompetencias.length > 0) {
          queryBuilder.andWhere('(cita.idUsuarioAsignado = :idUsuarioAsignado OR (cita.idUsuarioAsignado IS NULL AND (tramite.idCompetenciaRequerida IN (:...idsCompetencias) OR tramite.idCompetenciaRequerida IS NULL)))', { idUsuarioAsignado, idsCompetencias });
        } else {
          queryBuilder.andWhere('(cita.idUsuarioAsignado = :idUsuarioAsignado OR (cita.idUsuarioAsignado IS NULL AND tramite.idCompetenciaRequerida IS NULL))', { idUsuarioAsignado });
        }
      } else {
        queryBuilder.andWhere('cita.idUsuarioAsignado = :idUsuarioAsignado', { idUsuarioAsignado });
      }
    } else if (filterDto.includeUnassigned === 'true') {
      queryBuilder.andWhere('cita.idUsuarioAsignado IS NULL');
    }
    if (idCliente) {
      queryBuilder.andWhere('cita.idCliente = :idCliente', { idCliente });
    }

    if (forcedIdEntidad) {
      queryBuilder.andWhere('cita.idEntidad = :idEntidad', { idEntidad: forcedIdEntidad });
    }

    if (estado) {
      queryBuilder.andWhere('cita.estado = :estado', { estado });
    }
    if (fechaInicio && fechaFin) {
      queryBuilder.andWhere('cita.fechaHora >= :start AND cita.fechaHora <= :end', {
        start: `${fechaInicio} 00:00:00`,
        end: `${fechaFin} 23:59:59`,
      });
    } else if (fechaInicio) {
      queryBuilder.andWhere('cita.fechaHora >= :start AND cita.fechaHora <= :end', {
        start: `${fechaInicio} 00:00:00`,
        end: `${fechaInicio} 23:59:59`,
      });
    }

    try {
      const [citas, total] = await queryBuilder.getManyAndCount();

      return {
        data: citas,
        meta: {
          total,
          limit,
          offset,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Cita> {
    const cita = await this.citaRepository.findOne({
      where: { id },
      relations: ['usuarioAsignado', 'mesa', 'mesa.sala', 'tramite', 'turnoLlegada'],
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

  async getDisponibilidad(slotsFilterDto: SlotsFilterDto) {
    const { idEntidad, idTramite, fecha } = slotsFilterDto;

    const esFestivo = await this.festivoRepository.findOne({
      where: { idEntidad, fecha },
    });
    if (esFestivo) return [];

    const diaSemana = new Date(fecha + 'T00:00:00').getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      return [];
    }

    const entidad = await this.entidadRepository.findOne({
      where: { id: idEntidad },
    });
    if (!entidad)
      throw new NotFoundException(`Entidad ${idEntidad} no encontrada`);
    const duracion = entidad.duracionCitaMinutos || 30;

    const tramite = await this.tramiteRepository.findOne({
      where: { id: idTramite },
      relations: ['competenciaRequerida'],
    });
    if (!tramite)
      throw new NotFoundException(`Trámite ${idTramite} no encontrado`);
    const idCompReq = tramite.idCompetenciaRequerida;
    const normDate = (d: string | Date): string => {
      if (d instanceof Date) return d.toISOString().split('T')[0];
      const s = String(d);
      return s.length > 10 ? s.substring(0, 10) : s;
    };

    const horarios = await this.horarioRepository.find({
      where: { idEntidad },
    });

    const horario =
      horarios.find((h) => fecha >= normDate(h.fechaInicio) && fecha <= normDate(h.fechaFin)) ||
      horarios[0];

    if (!horario) return [];

    const todosLosUsuarios = await this.usuarioRepository.find({
      where: { idEntidad, activo: true },
      relations: ['ausencias', 'competencias'],
    });

    let usuariosBase = todosLosUsuarios;

    if (slotsFilterDto.idSala) {
      const asignacionesDelDia = await this.asignacionMesaRepository.find({
        where: { fecha, mesa: { idSala: slotsFilterDto.idSala } },
        relations: ['mesa'],
      });
      const idsUsuariosAsignados = asignacionesDelDia.map(a => a.idUsuario);
      
      if (idsUsuariosAsignados.length > 0) {
        usuariosBase = todosLosUsuarios.filter(u => idsUsuariosAsignados.includes(u.id));
      } else {
        usuariosBase = todosLosUsuarios;
      }
    }

    const usuariosAptos = usuariosBase.filter((u) => {
      const tieneCompetencia = idCompReq
        ? u.competencias.some((c) => c.id === idCompReq)
        : true;

      const tieneAusencia = u.ausencias.some(
        (a) =>
          a.estado === 'Aprobada' &&
          fecha >= normDate(a.fechaInicio) &&
          fecha <= normDate(a.fechaFin),
      );

      return tieneCompetencia && !tieneAusencia;
    });

    if (usuariosAptos.length === 0) return [];

    const citasDelDia = await this.citaRepository
      .createQueryBuilder('cita')
      .innerJoin('cita.mesa', 'mesa')
      .innerJoin('mesa.sala', 'sala')
      .where('sala.idEntidad = :idEntidad', { idEntidad })
      .andWhere('DATE(cita.fechaHora) = :fecha', { fecha })
      .getMany();

    const start = new Date(`${fecha}T${horario.horaApertura}`);
    const end = new Date(`${fecha}T${horario.horaCierre}`);
    const slots: string[] = [];
    let current = start;

    while (current < end) {
      const horaStr = current.toTimeString().split(' ')[0].substring(0, 5);

      const citasOcupadas = citasDelDia.filter((c) => {
        const d = new Date(c.fechaHora);
        return (
          d.getHours() === current.getHours() &&
          d.getMinutes() === current.getMinutes()
        );
      });

      if (citasOcupadas.length < usuariosAptos.length) {
        slots.push(horaStr);
      }

      current = new Date(current.getTime() + duracion * 60000);
    }

    return slots;
  }

  async reasignarMasivo(reasignarDto: ReasignarMasivoDto) {
    const { idEmpleadoOrigen, idEmpleadoDestino, fechaDesde, fechaHasta } =
      reasignarDto;

    const citas = await this.citaRepository
      .createQueryBuilder('cita')
      .where('cita.idUsuarioAsignado = :idOrigen', {
        idOrigen: idEmpleadoOrigen,
      })
      .andWhere('DATE(cita.fechaHora) >= :desde', { desde: fechaDesde })
      .andWhere('DATE(cita.fechaHora) <= :hasta', { hasta: fechaHasta })
      .andWhere("cita.estado = 'Pendiente'")
      .getMany();

    for (const cita of citas) {
      cita.idUsuarioAsignado = idEmpleadoDestino;
    }

    if (citas.length > 0) {
      await this.citaRepository.save(citas);
    }

    return { reasignadas: citas.length };
  }
}
