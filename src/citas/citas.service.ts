import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCitaDto, UpdateCitaDto } from './dto';
import { Cita } from './entities/cita.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Mesa } from 'src/mesas/entities/mesa.entity';
import { Festivo } from 'src/festivos/entities/festivo.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,

    @InjectRepository(Festivo)
    private readonly festivoRepository: Repository<Festivo>,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const mesa = await this.mesaRepository.findOne({
      where: { id: createCitaDto.idMesa },
      relations: ['sala'],
    });

    if (!mesa) {
      throw new NotFoundException(
        `Mesa con id ${createCitaDto.idMesa} no encontrada`,
      );
    }

    const idOficina = mesa.sala.idOficina;
    const fechaCita = new Date(createCitaDto.fechaHora);
    const fechaCitaString = fechaCita.toISOString().split('T')[0];

    const esFestivo = await this.festivoRepository.findOne({
      where: {
        idOficina: idOficina,
        fecha: fechaCitaString,
      },
    });

    if (esFestivo) {
      throw new BadRequestException(
        `No se puede crear la cita: El día ${fechaCitaString} es festivo en esta oficina (${esFestivo.descripcion || 'Festivo local'}).`,
      );
    }

    const citaOcupada = await this.citaRepository.findOne({
      where: {
        idMesa: createCitaDto.idMesa,
        fechaHora: fechaCita,
      },
    });

    if (citaOcupada) {
      throw new BadRequestException(
        'Esta mesa ya tiene una cita reservada para esa hora exacta.',
      );
    }

    const cita = this.citaRepository.create(createCitaDto);
    return await this.citaRepository.save(cita);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, search } = paginationDto;

    const queryBuilder = this.citaRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.usuarioAsignado', 'usuarioAsignado')
      .leftJoinAndSelect('cita.mesa', 'mesa')
      .leftJoinAndSelect('cita.tramite', 'tramite')
      .take(limit)
      .skip(offset)
      .orderBy('cita.fechaHora', 'DESC');

    if (search) {
      queryBuilder.where(
        '(LOWER(cita.clienteNombre) LIKE LOWER(:search) OR LOWER(cita.clienteApellidos) LIKE LOWER(:search) OR LOWER(cita.clienteDni) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const [citas, total] = await queryBuilder.getManyAndCount();

    return {
      data: citas,
      meta: {
        total,
        limit,
        offset,
      },
    };
  }

  async findOne(id: string): Promise<Cita> {
    const cita = await this.citaRepository.findOne({
      where: { id },
      relations: ['usuarioAsignado', 'mesa', 'tramite'],
    });

    if (!cita) throw new NotFoundException(`Cita con id ${id} no encontrada`);
    return cita;
  }

  async update(id: string, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.citaRepository.preload({
      id,
      ...updateCitaDto,
    });

    if (!cita) throw new NotFoundException(`Cita con id ${id} no encontrada`);

    return await this.citaRepository.save(cita);
  }

  async remove(id: string): Promise<void> {
    const cita = await this.findOne(id);
    await this.citaRepository.remove(cita);
  }
}
