import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competencia } from './entities/competencia.entity';
import { CreateCompetenciaDto, UpdateCompetenciaDto } from './dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class CompetenciasService {
  constructor(
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(
    createCompetenciaDto: CreateCompetenciaDto,
  ): Promise<Competencia> {
    try {
      const competencia =
        this.competenciaRepository.create(createCompetenciaDto);
      return await this.competenciaRepository.save(competencia);
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Ya existe esta competencia en la entidad',
        );
      }
      throw error;
    }
  }

  async findAll(idEntidad?: string): Promise<Competencia[]> {
    const query = this.competenciaRepository.createQueryBuilder('competencia')
      .leftJoinAndSelect('competencia.entidad', 'entidad')
      .leftJoinAndSelect('competencia.usuarios', 'usuarios');

    if (idEntidad) {
      query.where('competencia.id_entidad = :idEntidad', { idEntidad });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Competencia> {
    const competencia = await this.competenciaRepository.findOne({
      where: { id },
      relations: ['entidad', 'usuarios'],
    });
    if (!competencia)
      throw new NotFoundException(`Competencia con id ${id} no encontrada`);
    return competencia;
  }

  async update(
    id: string,
    updateCompetenciaDto: UpdateCompetenciaDto,
  ): Promise<Competencia> {
    const competencia = await this.competenciaRepository.preload({
      id,
      ...updateCompetenciaDto,
    });
    if (!competencia)
      throw new NotFoundException(`Competencia con id ${id} no encontrada`);
    return await this.competenciaRepository.save(competencia);
  }

  async remove(id: string): Promise<void> {
    const competencia = await this.findOne(id);
    await this.competenciaRepository.remove(competencia);
  }

  /** Asigna una competencia a un usuario */
  async asignarUsuario(id: string, idUsuario: string): Promise<Competencia> {
    const competencia = await this.findOne(id);
    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuario },
    });
    if (!usuario)
      throw new NotFoundException(`Usuario con id ${idUsuario} no encontrado`);

    const yaAsignado = competencia.usuarios?.some((u) => u.id === idUsuario);
    if (yaAsignado)
      throw new BadRequestException(
        'El usuario ya tiene esta competencia asignada',
      );

    competencia.usuarios = [...(competencia.usuarios ?? []), usuario];
    return await this.competenciaRepository.save(competencia);
  }

  /** Desasigna una competencia de un usuario */
  async desasignarUsuario(id: string, idUsuario: string): Promise<Competencia> {
    const competencia = await this.findOne(id);
    competencia.usuarios = (competencia.usuarios ?? []).filter(
      (u) => u.id !== idUsuario,
    );
    return await this.competenciaRepository.save(competencia);
  }
}
