import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

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

  // Nota: Las relaciones OneToMany (usuarios, salas, citas...) las iré
  // añadiendo aquí conforme vaya refactorizando esos módulos para no romper nada ahora.
}
