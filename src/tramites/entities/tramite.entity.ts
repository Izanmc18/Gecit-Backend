import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cita } from '../../citas/entities/cita.entity';

@Entity('tramites')
export class Tramite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_tramite', length: 150 })
  nombreTramite: string;

  @OneToMany(() => Cita, (cita) => cita.tramite)
  citas: Cita[];
}
