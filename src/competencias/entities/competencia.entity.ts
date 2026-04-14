import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entidad } from '../../entidades/entities/entidad.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity({ name: 'competencias' })
export class Competencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_entidad' })
  idEntidad: string;

  @Column('varchar', { name: 'nombre_competencia', length: 100 })
  nombreCompetencia: string;

  @ManyToOne(() => Entidad, (entidad) => entidad.competencias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_entidad' })
  entidad: Entidad;

  @ManyToMany(() => Usuario, (usuario) => usuario.competencias)
  @JoinTable({
    name: 'usuario_competencias',
    joinColumn: { name: 'id_competencia', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_usuario', referencedColumnName: 'id' },
  })
  usuarios: Usuario[];
}
