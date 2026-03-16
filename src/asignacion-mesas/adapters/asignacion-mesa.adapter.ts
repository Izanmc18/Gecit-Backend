import {
  AsignacionMesa,
  TurnoAsignacion,
} from '../entities/asignacion-mesa.entity';

export class AsignacionMesaResponse {
  id: string;
  idUsuario: string;
  idMesa: string;
  fecha: string;
  turno: TurnoAsignacion;
}

export class AsignacionMesaAdapter {
  static toResponse(asignacion: AsignacionMesa): AsignacionMesaResponse {
    return {
      id: asignacion.id,
      idUsuario: asignacion.idUsuario,
      idMesa: asignacion.idMesa,
      fecha: asignacion.fecha,
      turno: asignacion.turno,
    };
  }

  static toResponseList(
    asignaciones: AsignacionMesa[],
  ): AsignacionMesaResponse[] {
    return asignaciones.map((asignacion) => this.toResponse(asignacion));
  }
}
