
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
    // 1. Limpieza total y ordenada de tablas desactivando FOREIGN_KEY_CHECKS para evitar errores de FK
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
      await queryRunner.query('TRUNCATE TABLE turnos_llegada');
      await queryRunner.query('TRUNCATE TABLE asignacion_mesas');
      await queryRunner.query('TRUNCATE TABLE ausencias');
      await queryRunner.query('TRUNCATE TABLE competencias');
      await queryRunner.query('TRUNCATE TABLE horarios');
      await queryRunner.query('TRUNCATE TABLE festivos');
      await queryRunner.query('TRUNCATE TABLE citas');
      await queryRunner.query('TRUNCATE TABLE mesas');
      await queryRunner.query('TRUNCATE TABLE salas');
      await queryRunner.query('TRUNCATE TABLE usuarios');
      await queryRunner.query('TRUNCATE TABLE entidades');
      await queryRunner.query('TRUNCATE TABLE roles');
      await queryRunner.query('TRUNCATE TABLE tramites');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    // 2. Ejecutar la siembra con IDs de rol correctos y estáticos
    const roles = await this.seedRoles();

    const entities = await this.seedEntities();

    const tramites = await this.seedTramites(entities);

    await this.seedUsers(entities, roles);

    await this.seedResources(entities);

    await this.seedAppointments(entities, tramites);

    return { message: 'Seed executed successfully' };
  }

  private async seedRoles() {
    const roleMappings = [
      { name: 'SuperAdmin', id: 'e51b3a32-0000-4a3b-9a99-b1d5c7f8a120' },
      { name: 'Admin', id: 'e51b3a32-1111-4a3b-9a99-b1d5c7f8a121' },
      { name: 'Empleado', id: 'e51b3a32-2222-4a3b-9a99-b1d5c7f8a122' },
      { name: 'Cliente', id: 'e51b3a32-3333-4a3b-9a99-b1d5c7f8a123' },
    ];
    const roles: Record<string, Rol> = {};

    for (const item of roleMappings) {
      let role = await this.rolRepo.findOne({ where: { id: item.id } });
      if (!role) {
        // En caso de que exista por nombre pero con otro ID
        const existingByName = await this.rolRepo.findOne({ where: { nombreRol: item.name } });
        if (existingByName) {
          await this.rolRepo.delete(existingByName.id);
        }
        role = await this.rolRepo.save(this.rolRepo.create({ id: item.id, nombreRol: item.name }));
      }
      roles[item.name] = role;
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
    const innovasurEnt = entities.find(e => e.dominio === 'innovasur.com') || entities[0];

    // 1. Cuentas específicas personalizadas requeridas
    const customUsers = [
      {
        nombre: 'Super',
        apellidos: 'Admin',
        email: 'superadmin@gecit.com',
        password: 'superadmin123',
        roleName: 'SuperAdmin',
        idEntidad: undefined as string | undefined,
      },
      {
        nombre: 'Admin',
        apellidos: 'Innovasur',
        email: 'admin@innovasur.com',
        password: 'admin123',
        roleName: 'Admin',
        idEntidad: innovasurEnt.id as string | undefined,
      },
      {
        nombre: 'Trabajador',
        apellidos: 'Gecit',
        email: 'trabajador@gecit.com',
        password: '12345678',
        roleName: 'Empleado',
        idEntidad: innovasurEnt.id as string | undefined,
      }
    ];

    for (const u of customUsers) {
      const exists = await this.usuarioRepo.findOne({ where: { email: u.email } });
      if (!exists) {
        const role = roles[u.roleName];
        await this.usuarioRepo.save(this.usuarioRepo.create({
          nombre: u.nombre,
          apellidos: u.apellidos,
          email: u.email,
          passwordHash: bcrypt.hashSync(u.password, 10),
          idRol: role.id,
          idEntidad: u.idEntidad
        }));
      }
    }

    // 2. Usuarios adicionales para poblar la demo
    const passwordHash = bcrypt.hashSync('admin123', 10);

    for (let i = 0; i < 15; i++) {
      const email = `user${i}@gecit.com`;
      const exists = await this.usuarioRepo.findOne({ where: { email } });
      if (!exists) {
        const ent = entities[i % entities.length];
        const role = i === 0 ? roles['SuperAdmin'] : (i < 3 ? roles['Admin'] : (i < 10 ? roles['Empleado'] : roles['Cliente']));
        
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

  private async seedTramites(entities: Entidad[]) {
    const tramites: Record<string, Tramite> = {};
    const nombresTramite = ['Gestión de Trámites Generales', 'Licencias', 'Padrón y Censo'];

    for (const ent of entities) {
      for (const nombre of nombresTramite) {
        let tramite = await this.tramiteRepo.findOne({ where: { nombreTramite: nombre, idEntidad: ent.id } });
        if (!tramite) {
          tramite = await this.tramiteRepo.save(this.tramiteRepo.create({
            nombreTramite: nombre,
            descripcion: `Descripción para ${nombre}`,
            idEntidad: ent.id,
          }));
        }
        tramites[`${ent.dominio}_${nombre}`] = tramite;
      }
    }
    return tramites;
  }

  private async seedAppointments(entities: Entidad[], tramites: Record<string, Tramite>) {
    const demoDates = ['2026-05-18', '2026-05-19', '2026-05-20'];
    const hours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'];

    for (const ent of entities) {
      const defaultTramite = tramites[`${ent.dominio}_Gestión de Trámites Generales`] || Object.values(tramites).find(t => t.idEntidad === ent.id);
      if (!defaultTramite) continue;

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2);
      const pastDateStr = pastDate.toISOString().split('T')[0];

      const exists = await this.citaRepo.count({ where: { idEntidad: ent.id } });
      if (exists < 5) {
         // Historial (Días pasados)
         for (let i = 0; i < 5; i++) {
            await this.citaRepo.save(this.citaRepo.create({
              idEntidad: ent.id,
              clienteNombre: ['Juan', 'Maria', 'Pedro', 'Ana', 'Luis'][i],
              clienteApellidos: ['Gomez', 'Sanchez', 'Martinez', 'Ruiz', 'Fernandez'][i],
              clienteEmail: `past${i}@test.com`,
              clienteDni: `1234567${i}K`,
              clienteTelefono: `60000000${i}`,
              fechaHora: new Date(`${pastDateStr} 10:00:00`),
              estado: EstadoCita.REALIZADA,
              idTramite: defaultTramite.id
            }));
         }

         // Próximos días (Presentación)
         let count = 0;
         for (const date of demoDates) {
            for (const hour of hours) {
              // Mezclar estados para que los gráficos tengan variedad
              let estado = EstadoCita.PENDIENTE;
              if (date === '2026-05-18' && parseInt(hour.split(':')[0]) < 11) {
                estado = EstadoCita.REALIZADA; // Algunas ya atendidas por la mañana
              } else if (count % 8 === 0) {
                estado = EstadoCita.CANCELADA; // Alguna cancelada para dar realismo
              } else if (count % 12 === 0) {
                estado = EstadoCita.NO_PRESENTADO; // Alguna no presentada
              }

              // Generar DNI válido y datos reales
              const numDni = 23456780 + count;
              const dniLetter = 'TRWAGMYFPDXBNJZSQVHLCKE'[numDni % 23];
              const dni = `${numDni}${dniLetter}`;

              await this.citaRepo.save(this.citaRepo.create({
                idEntidad: ent.id,
                clienteNombre: ['Carlos', 'Sofía', 'Alejandro', 'Laura', 'David', 'Marta', 'Javier', 'Elena', 'Diego', 'Carmen'][count % 10],
                clienteApellidos: ['Pérez', 'López', 'González', 'Rodríguez', 'Marín', 'García', 'Molina', 'Ortiz', 'Torres', 'Navarro'][count % 10],
                clienteEmail: `cliente${count}@innovasur.com`,
                clienteDni: dni,
                clienteTelefono: `61234567${count % 10}`,
                fechaHora: new Date(`${date} ${hour}:00`),
                estado: estado,
                idTramite: defaultTramite.id
              }));
              count++;
            }
         }
      }
    }
  }
}
