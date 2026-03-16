import { Horario } from '../entities/horario.entity';

export class HorarioResponse {
  id: string;
  idOficina: string;
  fechaInicio: string;
  fechaFin: string;
  horaApertura: string;
  horaCierre: string;
}

export class HorarioAdapter {
  static toResponse(horario: Horario): HorarioResponse {
    return {
      id: horario.id,
      idOficina: horario.idOficina,
      fechaInicio: horario.fechaInicio,
      fechaFin: horario.fechaFin,
      horaApertura: horario.horaApertura,
      horaCierre: horario.horaCierre,
    };
  }

  static toResponseList(horarios: Horario[]): HorarioResponse[] {
    return horarios.map((horario) => this.toResponse(horario));
  }
}
