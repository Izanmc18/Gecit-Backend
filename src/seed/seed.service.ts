
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Entidad } from '../entidades/entities/entidad.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { Sala } from '../salas/entities/sala.entity';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Cita, EstadoCita } from '../citas/entities/cita.entity';
import { Tramite } from '../tramites/entities/tramite.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Entidad) private readonly entidadRepo: Repository<Entidad>,
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
    @InjectRepository(Sala) private readonly salaRepo: Repository<Sala>,
    @InjectRepository(Mesa) private readonly mesaRepo: Repository<Mesa>,
    @InjectRepository(Cita) private readonly citaRepo: Repository<Cita>,
    @InjectRepository(Tramite) private readonly tramiteRepo: Repository<Tramite>,
  ) {}

  async runSeed() {

    const roles = await this.seedRoles();

    const entities = await this.seedEntities();

    await this.seedUsers(entities, roles);

    await this.seedResources(entities);

    await this.seedAppointments(entities);

    return { message: 'Seed executed successfully' };
  }

  private async seedRoles() {
    const roleNames = ['SuperAdmin', 'Admin', 'Empleado', 'Cliente'];
    const roles: Record<string, Rol> = {};

    for (const name of roleNames) {
      let role = await this.rolRepo.findOne({ where: { nombreRol: name } });
      if (!role) {
        role = await this.rolRepo.save(this.rolRepo.create({ nombreRol: name }));
      }
      roles[name] = role;
    }
    return roles;
  }

  private async seedEntities() {
    const data = [
      { nombre: 'Ayuntamiento de Jaén', dominio: 'jaen.es', delayMonths: 5 },
      { nombre: 'Ayuntamiento de Linares', dominio: 'linares.es', delayMonths: 4 },
      { nombre: 'Ayuntamiento de Úbeda', dominio: 'ubeda.es', delayMonths: 3 },
      { nombre: 'Ayuntamiento de Martos', dominio: 'martos.es', delayMonths: 2 },
      { nombre: 'Innovasur S.L.', dominio: 'innovasur.com', delayMonths: 1 },
    ];

    const entities: Entidad[] = [];
    for (const item of data) {
      let ent = await this.entidadRepo.findOne({ where: { dominio: item.dominio } });
      if (!ent) {
        const date = new Date();
        date.setMonth(date.getMonth() - item.delayMonths);
        ent = this.entidadRepo.create({
          nombre: item.nombre,
          dominio: item.dominio,
          cif: `A${Math.floor(Math.random() * 90000000 + 10000000)}`,
        });
        ent = await this.entidadRepo.save(ent);

        await this.dataSource.query('UPDATE entidades SET fecha_creacion = ? WHERE id = ?', [date, ent.id]);
      }
      entities.push(ent);
    }
    return entities;
  }

  private async seedUsers(entities: Entidad[], roles: Record<string, Rol>) {
    const passwordHash = bcrypt.hashSync('admin123', 10);

    for (let i = 0; i < 15; i++) {
      const email = `user${i}@gecit.com`;
      const exists = await this.usuarioRepo.findOne({ where: { email } });
      if (!exists) {
        const ent = entities[i % entities.length];
        const role = i < 3 ? roles['Admin'] : (i < 10 ? roles['Empleado'] : roles['Cliente']);
        
        await this.usuarioRepo.save(this.usuarioRepo.create({
          nombre: `User ${i}`,
          apellidos: `Test ${i}`,
          email,
          passwordHash,
          idRol: role.id,
          idEntidad: ent.id
        }));
      }
    }
  }

  private async seedResources(entities: Entidad[]) {
    for (const ent of entities) {
      const roomsCount = await this.salaRepo.count({ where: { idEntidad: ent.id } });
      if (roomsCount === 0) {
        const sala = await this.salaRepo.save(this.salaRepo.create({
          nombreSala: 'Planta Principal',
          idEntidad: ent.id
        }));

        for (let j = 0; j < 5; j++) {
          await this.mesaRepo.save(this.mesaRepo.create({
            nombreMesa: `Mesa ${j + 1}`,
            idSala: sala.id,
            posX: 100 + (j * 150),
            posY: 200,
            ancho: 80,
            largo: 60
          }));
        }
      }
    }
  }

  private async seedAppointments(entities: Entidad[]) {
    const demoDates = ['2026-05-18', '2026-05-19'];
    const hours = ['09:00', '10:30', '12:00', '13:30'];

    for (const ent of entities) {

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2);
      const pastDateStr = pastDate.toISOString().split('T')[0];

      const exists = await this.citaRepo.count({ where: { idEntidad: ent.id } });
      if (exists < 5) {

         for (let i = 0; i < 3; i++) {
            await this.citaRepo.save(this.citaRepo.create({
              idEntidad: ent.id,
              clienteNombre: 'Histórico',
              clienteApellidos: `Demo ${i}`,
              clienteEmail: `past${i}@test.com`,
              clienteDni: `1234567${i}X`,
              fechaHora: new Date(`${pastDateStr} 10:00:00`),
              estado: EstadoCita.REALIZADA
            }));
         }

         for (const date of demoDates) {
            for (const hour of hours) {
              await this.citaRepo.save(this.citaRepo.create({
                idEntidad: ent.id,
                clienteNombre: 'Presentación',
                clienteApellidos: 'Innovasur',
                clienteEmail: 'demo@innovasur.com',
                clienteDni: '99999999Z',
                fechaHora: new Date(`${date} ${hour}:00`),
                estado: EstadoCita.PENDIENTE
              }));
            }
         }
      }
    }
  }
}
