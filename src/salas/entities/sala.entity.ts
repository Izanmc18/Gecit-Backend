import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Oficina } from '../../oficinas/entities/oficina.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';

@Entity('salas')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_oficina' })
  idOficina: number;

  @Column({ name: 'nombre_sala', length: 100 })
  nombreSala: string;

  @ManyToOne(() => Oficina, (oficina) => oficina.salas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_oficina' })
  oficina: Oficina;

  @OneToMany(() => Mesa, (mesa) => mesa.sala)
  mesas: Mesa[];
}
