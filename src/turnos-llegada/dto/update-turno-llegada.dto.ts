import { PartialType } from '@nestjs/swagger';
import { CreateTurnoLlegadaDto } from './create-turno-llegada.dto';

export class UpdateTurnoLlegadaDto extends PartialType(CreateTurnoLlegadaDto) {}
