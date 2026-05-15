import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Sala } from '../../salas/entities/sala.entity';
import { Tramite } from '../../tramites/entities/tramite.entity';
import { Festivo } from '../../festivos/entities/festivo.entity';
import { Horario } from '../../horarios/entities/horario.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { Competencia } from '../../competencias/entities/competencia.entity';
import { TurnoLlegada } from '../../turnos-llegada/entities/turno-llegada.entity';

@Entity({ name: 'entidades' })
export class Entidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 20, unique: true })
  cif: string;

  @Column('varchar', { length: 100, unique: true, nullable: true })
  dominio: string;

  @Column('int', { name: 'duracion_cita_minutos', default: 30 })
  duracionCitaMinutos: number;

  @Column('boolean', { default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @OneToMany(() => Usuario, (usuario) => usuario.entidad)
  usuarios: Usuario[];

  @OneToMany(() => Sala, (sala) => sala.entidad)
  salas: Sala[];

  @OneToMany(() => Tramite, (tramite) => tramite.entidad)
  tramites: Tramite[];

  @OneToMany(() => Festivo, (festivo) => festivo.entidad)
  festivos: Festivo[];

  @OneToMany(() => Horario, (horario) => horario.entidad)
  horarios: Horario[];

  @OneToMany(() => Cita, (cita) => cita.entidad)
  citas: Cita[];

  @OneToMany(() => Competencia, (competencia) => competencia.entidad)
  competencias: Competencia[];

  @OneToMany(() => TurnoLlegada, (turno) => turno.entidad)
  turnosLlegada: TurnoLlegada[];
}
