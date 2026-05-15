
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Entidad } from '../entidades/entities/entidad.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Cita, EstadoCita } from '../citas/entities/cita.entity';
import { TurnoLlegada, EstadoTurno } from '../turnos-llegada/entities/turno-llegada.entity';
import { Sala } from '../salas/entities/sala.entity';
import { Mesa } from '../mesas/entities/mesa.entity';

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

  async getDashboardSummary(idEntidad: string) {
    try {

      const totalCitas = await this.citaRepository.count({ where: { idEntidad } });
      const realizadas = await this.citaRepository.count({ where: { idEntidad, estado: EstadoCita.REALIZADA } });

      const empleadosActivos = await this.usuarioRepository.count({ 
        where: { idEntidad, rol: { nombreRol: 'Empleado' } } 
      });

      const weeklyRaw = await this.citaRepository.createQueryBuilder('cita')
        .select("DATE_FORMAT(fecha_hora, '%Y-%m-%d')", 'date')
        .addSelect('COUNT(*)', 'count')
        .where('id_entidad = :idEntidad', { idEntidad })
        .andWhere('fecha_hora >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)')
        .groupBy('date')
        .getRawMany();

      const graficaCitas: any[] = [];
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const isoDate = d.toISOString().split('T')[0];
        const dayMatch = weeklyRaw.find(r => r.date === isoDate);
        graficaCitas.push({ 
          name: days[d.getDay()], 
          value: dayMatch ? parseInt(dayMatch.count) : 0 
        });
      }

      const tramitesData = await this.citaRepository.createQueryBuilder('cita')
        .innerJoin('cita.tramite', 'tramite')
        .select('tramite.nombreTramite', 'name')
        .addSelect('COUNT(*)', 'value')
        .where('cita.id_entidad = :idEntidad', { idEntidad })
        .groupBy('tramite.nombreTramite')
        .getRawMany();

      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const hoyStats = await this.citaRepository.createQueryBuilder('cita')
        .select('estado')
        .addSelect('COUNT(*)', 'count')
        .where('id_entidad = :idEntidad', { idEntidad })
        .andWhere('DATE(fecha_hora) = CURDATE()')
        .groupBy('estado')
        .getRawMany();

      const hoyTotal = hoyStats.reduce((acc, curr) => acc + parseInt(curr.count), 0);
      const hoyRealizadas = hoyStats.find(s => s.estado === EstadoCita.REALIZADA)?.count || 0;

      const ayerTotal = await this.citaRepository.createQueryBuilder('cita')
        .where('id_entidad = :idEntidad', { idEntidad })
        .andWhere('DATE(fecha_hora) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)')
        .getCount();

      const tendencia = ayerTotal === 0 ? 100 : Math.round(((hoyTotal - ayerTotal) / ayerTotal) * 100);

      return {
        totalCitas,
        realizadas,
        empleadosActivos,
        esperaMedia: 8,
        graficaCitas,
        hoy: {
          total: hoyTotal,
          realizadas: parseInt(hoyRealizadas),
          pendientes: hoyTotal - parseInt(hoyRealizadas),
          tendencia: tendencia
        },
        tramitesStats: tramitesData.length > 0 ? tramitesData : [{ name: 'Sin citas', value: 1 }],
      };
    } catch (error) {
      console.error('Error in getDashboardSummary:', error);
      return {
        totalCitas: 0,
        realizadas: 0,
        empleadosActivos: 0,
        esperaMedia: 10,
        graficaCitas: [],
        hoy: { total: 0, realizadas: 0, pendientes: 0, tendencia: 0 },
        tramitesStats: [{ name: 'Error', value: 1 }]
      };
    }
  }

  async getGlobalStats() {
    try {
      const totalEntities = await this.entidadRepository.count();
      const totalUsers = await this.usuarioRepository.count();

      const entidadesNuevasMes = await this.entidadRepository.createQueryBuilder('entidad')
        .where('entidad.fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)')
        .getCount();

      const totalSalas = await this.entidadRepository.manager.count(Sala);
      const totalMesas = await this.entidadRepository.manager.count(Mesa);

      const growthRaw = await this.entidadRepository.createQueryBuilder('entidad')
        .select("DATE_FORMAT(fecha_creacion, '%Y-%m')", 'month')
        .addSelect('COUNT(*)', 'count')
        .where('fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)')
        .groupBy('month')
        .orderBy('month', 'ASC')
        .getRawMany();

      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const platformGrowth = growthRaw.map(r => ({
        name: months[parseInt(r.month.split('-')[1]) - 1] || r.month,
        value: parseInt(r.count)
      }));

      const roleDistRaw = await this.usuarioRepository.createQueryBuilder('usuario')
        .innerJoin('roles', 'rol', 'usuario.id_rol = rol.id')
        .select('rol.nombre_rol', 'name')
        .addSelect('COUNT(*)', 'value')
        .groupBy('rol.nombre_rol')
        .getRawMany();

      const userDistribution = roleDistRaw.map(r => ({
        name: r.name,
        value: parseInt(r.value)
      }));

      return {
        totalEntities,
        totalUsers,
        totalResources: totalSalas + totalMesas,
        platformGrowth: platformGrowth.length > 0 ? platformGrowth : [{ name: 'N/A', value: 0 }],
        userDistribution: userDistribution.length > 0 ? userDistribution : [{ name: 'Sin datos', value: 0 }]
      };
    } catch (error) {
      console.error('Error in getGlobalStats:', error);
      return {
        totalEntities: 0,
        totalUsers: 0,
        totalResources: 0,
        platformGrowth: [],
        userDistribution: []
      };
    }
  }

  async getEntidadStats(id: string) { return {}; }
  async getHeatmap() { return {}; }
}
