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
import { Cita, EstadoCita } from './entities/cita.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Mesa } from 'src/mesas/entities/mesa.entity';
import { Festivo } from 'src/festivos/entities/festivo.entity';
import { Entidad } from 'src/entidades/entities/entidad.entity';
import { Horario } from 'src/horarios/entities/horario.entity';
import { Ausencia } from 'src/ausencias/entities/ausencia.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

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
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const mesa = await this.mesaRepository.findOne({
      where: { id: createCitaDto.idMesa },
      relations: ['sala'],
    });

    if (!mesa) {
      throw new NotFoundException(
        `Mesa con id ${createCitaDto.idMesa} no encontrada`,
      );
    }

    const idEntidad = mesa.sala.idEntidad;
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

    const cita = this.citaRepository.create(createCitaDto);
    return await this.citaRepository.save(cita);
  }

  async findAll(filterDto: FilterCitaDto) {
    const {
      limit = 10,
      offset = 0,
      search,
      idUsuarioAsignado,
      idCliente,
      idEntidad,
      estado,
      fechaInicio,
      fechaFin,
    } = filterDto;

    const queryBuilder = this.citaRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.usuarioAsignado', 'usuarioAsignado')
      .leftJoinAndSelect('cita.mesa', 'mesa')
      .leftJoinAndSelect('mesa.sala', 'sala')
      .leftJoinAndSelect('cita.tramite', 'tramite')
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
      queryBuilder.andWhere('cita.idUsuarioAsignado = :idUsuarioAsignado', { idUsuarioAsignado });
    }
    if (idCliente) {
      queryBuilder.andWhere('cita.idCliente = :idCliente', { idCliente });
    }
    if (idEntidad) {
      queryBuilder.andWhere('sala.idEntidad = :idEntidad', { idEntidad });
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
      relations: ['usuarioAsignado', 'mesa', 'tramite'],
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

    const horarios = await this.horarioRepository.find({
      where: { idEntidad },
    });
    const horario =
      horarios.find((h) => fecha >= h.fechaInicio && fecha <= h.fechaFin) ||
      horarios[0];

    if (!horario) return [];

    const todosLosUsuarios = await this.usuarioRepository.find({
      where: { idEntidad, activo: true },
      relations: ['ausencias', 'competencias'],
    });

    const usuariosAptos = todosLosUsuarios.filter((u) => {
      const tieneCompetencia = idCompReq
        ? u.competencias.some((c) => c.id === idCompReq)
        : true;

      const tieneAusencia = u.ausencias.some(
        (a) =>
          a.estado === 'Aprobada' &&
          fecha >= a.fechaInicio &&
          fecha <= a.fechaFin,
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
