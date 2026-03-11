import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Sala } from '../../salas/entities/sala.entity';
import { Festivo } from '../../festivos/entities/festivo.entity';
import { Horario } from '../../horarios/entities/horario.entity';

@Entity('oficinas')
export class Oficina {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 200, nullable: true })
  direccion: string;

  @Column({ name: 'duracion_cita_minutos', default: 30 })
  duracionCitaMinutos: number;

  @OneToMany(() => Sala, (sala) => sala.oficina)
  salas: Sala[];

  @OneToMany(() => Festivo, (festivo) => festivo.oficina)
  festivos: Festivo[];

  @OneToMany(() => Horario, (horario) => horario.oficina)
  horarios: Horario[];
}
