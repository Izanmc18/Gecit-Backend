import { PartialType } from '@nestjs/mapped-types';
import { CreateAsignacionMesaDto } from './create-asignacion-mesa.dto';

export class UpdateAsignacionMesaDto extends PartialType(CreateAsignacionMesaDto) {}
