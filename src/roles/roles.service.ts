/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto, UpdateRolDto } from './dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto) {
    try {
      const rol = this.rolRepository.create(createRolDto);
      await this.rolRepository.save(rol);
      return rol;
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El rol ya existe');
      }
      throw error;
    }
  }

  async findAll() {
    return this.rolRepository.find();
  }

  async findOne(id: string) {
    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    return rol;
  }

  async update(id: string, updateRolDto: UpdateRolDto) {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRolDto);

    try {
      await this.rolRepository.save(rol);
      return rol;
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El nombre de rol ya está en uso');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const rol = await this.findOne(id);

    try {
      await this.rolRepository.remove(rol);
    } catch (error: any) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new BadRequestException(
          'No se puede eliminar este rol porque hay usuarios activos que lo tienen asignado.',
        );
      }
      throw error;
    }
  }
}
