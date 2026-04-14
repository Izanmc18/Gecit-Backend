/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entidad } from '../entidades/entities/entidad.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Cita } from '../citas/entities/cita.entity';

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
    const citasCompletadas = await this.citaRepository.count({
      where: { estado: 'Realizada' as any },
    });

    return {
      totalEntidades,
      totalUsuarios,
      totalCitas,
      citasCompletadas,
      tasaCompletitud:
        totalCitas > 0 ? (citasCompletadas / totalCitas) * 100 : 0,
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
