import { TurnoLlegada, EstadoTurno } from '../entities/turno-llegada.entity';

export class TurnoLlegadaResponse {
  id: string;
  idEntidad: string;
  idCita: string | null;
  codigoTicket: string;
  estado: EstadoTurno;
  fechaGeneracion: Date;
  fechaLlamada: Date | null;
}

export class TurnoLlegadaAdapter {
  static toResponse(turno: TurnoLlegada): TurnoLlegadaResponse {
    return {
      id: turno.id,
      idEntidad: turno.idEntidad,
      idCita: turno.idCita || null,
      codigoTicket: turno.codigoTicket,
      estado: turno.estado,
      fechaGeneracion: turno.fechaGeneracion,
      fechaLlamada: turno.fechaLlamada || null,
    };
  }

  static toResponseList(turnos: TurnoLlegada[]): TurnoLlegadaResponse[] {
    return turnos.map((t) => this.toResponse(t));
  }
}
