import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Oficina } from '../../oficinas/entities/oficina.entity';

@Entity('festivos')
export class Festivo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_oficina' })
  idOficina: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ length: 150, nullable: true })
  descripcion: string;

  @ManyToOne(() => Oficina, (oficina) => oficina.festivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_oficina' })
  oficina: Oficina;
}
