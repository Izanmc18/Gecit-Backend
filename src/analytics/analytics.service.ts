/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entidad } from '../entidades/entities/entidad.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Cita, EstadoCita } from '../citas/entities/cita.entity';
import {
  TurnoLlegada,
  EstadoTurno,
} from '../turnos-llegada/entities/turno-llegada.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Entidad)
    private readonly entidadRepository: Repository<Entidad>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  async getGlobalStats() {
    const totalEntidades = await this.entidadRepository.count();
    const totalUsuarios = await this.usuarioRepository.count();
    const totalCitas = await this.citaRepository.count();
    
   
    const turnosAtendidos = await this.citaRepository.manager
      .createQueryBuilder(TurnoLlegada, 'turno')
      .where('turno.estado = :estado', { estado: EstadoTurno.ATENDIDO })
      .andWhere('turno.fechaLlamada IS NOT NULL')
      .getMany();

    let esperaMedia = 0;
    if (turnosAtendidos.length > 0) {
      const sum = turnosAtendidos.reduce((acc, t) => {
        const diff = t.fechaLlamada.getTime() - t.fechaGeneracion.getTime();
        return acc + diff;
      }, 0);
      esperaMedia = Math.round(sum / turnosAtendidos.length / 60000);
    }

   
    const weeklyData: any[] = [];
    for (let i = 3; i >= 0; i--) {
      const count = await this.citaRepository
        .createQueryBuilder('cita')
        .where('DATE(fecha_hora) >= CURDATE() - INTERVAL :start DAY', { start: (i + 1) * 7 })
        .andWhere('DATE(fecha_hora) < CURDATE() - INTERVAL :end DAY', { end: i * 7 })
        .getCount();
      weeklyData.push({ name: `Semana ${4-i}`, value: count });
    }

    const totalCitasRealizadas = await this.citaRepository.count({
      where: { estado: EstadoCita.REALIZADA }
    });

    return {
      totalEntidades,
      totalUsuarios,
      totalCitas,
      esperaMedia: esperaMedia || 10,
      totalCitasRealizadas,
      weeklyData
    };
  }

  async getEntidadStats(idEntidad: string) {
    const totalUsuarios = await this.usuarioRepository.count({
      where: { idEntidad },
    });

    const citasEntidad = await this.citaRepository
      .createQueryBuilder('cita')
      .innerJoin('cita.mesa', 'mesa')
      .innerJoin('mesa.sala', 'sala')
      .where('sala.idEntidad = :idEntidad', { idEntidad })
      .getCount();

    return {
      idEntidad,
      totalUsuarios,
      totalCitas: citasEntidad,
    };
  }

  async getDashboardSummary(idEntidad: string) {
    const totalCitas = await this.citaRepository.count({
      where: { idEntidad },
    });
    const realizadas = await this.citaRepository.count({
      where: { idEntidad, estado: EstadoCita.REALIZADA },
    });

   
    const empleadosActivos = await this.usuarioRepository.count({
      where: { idEntidad, idRol: 'e51b3a32-2222-4a3b-9a99-b1d5c7f8a122' },
    });

   
    const turnosAtendidos = await this.citaRepository.manager
      .createQueryBuilder(TurnoLlegada, 'turno')
      .innerJoin('turno.cita', 'cita')
      .where('cita.idEntidad = :idEntidad', { idEntidad })
      .andWhere('turno.estado = :estado', { estado: EstadoTurno.ATENDIDO })
      .andWhere('turno.fechaLlamada IS NOT NULL')
      .getMany();

    let esperaMedia = 0;
    if (turnosAtendidos.length > 0) {
      const sum = turnosAtendidos.reduce((acc, t) => {
        const diff = t.fechaLlamada.getTime() - t.fechaGeneracion.getTime();
        return acc + diff;
      }, 0);
      esperaMedia = Math.round(sum / turnosAtendidos.length / 60000);
    }

   
    const graficaCitas: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('es-ES', { weekday: 'short' });

      const count = await this.citaRepository
        .createQueryBuilder('cita')
        .where('id_entidad = :idEntidad', { idEntidad })
        .andWhere('DATE(fecha_hora) = CURDATE() - INTERVAL :i DAY', { i })
        .getCount();

      graficaCitas.push({ name: dayStr, value: count });
    }

   
    const tramitesData = await this.citaRepository
      .createQueryBuilder('cita')
      .leftJoin('cita.tramite', 'tramite')
      .select('tramite.nombre', 'name')
      .addSelect('COUNT(cita.id)', 'value')
      .where('cita.id_entidad = :idEntidad', { idEntidad })
      .groupBy('tramite.nombre')
      .getRawMany();

    return {
      totalCitas,
      realizadas,
      empleadosActivos,
      esperaMedia: esperaMedia || 12,
      graficaCitas,
      tramitesStats:
        tramitesData.length > 0
          ? tramitesData
          : [{ name: 'Sin datos', value: 0 }],
    };
  }

  async getHeatmap() {
    const citas = await this.citaRepository.find({ select: ['fechaHora'] });
    const heatmap = {};

    citas.forEach((cita) => {
      const hora = new Date(cita.fechaHora).getHours();
      const tramo = `${hora}:00 - ${hora + 1}:00`;
      heatmap[tramo] = (heatmap[tramo] || 0) + 1;
    });

    return heatmap;
  }
}
