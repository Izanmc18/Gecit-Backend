import {
  Ausencia,
  EstadoAusencia,
  TipoAusencia,
} from '../entities/ausencia.entity';

export class AusenciaResponse {
  id: string;
  idUsuario: string;
  usuarioNombre?: string;
  usuarioEmail?: string;
  fechaSolicitud: string;
  fechaInicio: string;
  fechaFin: string;
  tipo: TipoAusencia;
  estado: EstadoAusencia;
}

export class AusenciaAdapter {
  static toResponse(ausencia: Ausencia): AusenciaResponse {
    return {
      id: ausencia.id,
      idUsuario: ausencia.idUsuario,
      usuarioNombre: ausencia.usuario
        ? `${ausencia.usuario.nombre} ${ausencia.usuario.apellidos}`
        : undefined,
      usuarioEmail: ausencia.usuario?.email,
      fechaSolicitud: ausencia.fechaSolicitud,
      fechaInicio: ausencia.fechaInicio,
      fechaFin: ausencia.fechaFin,
      tipo: ausencia.tipo,
      estado: ausencia.estado,
    };
  }

  static toResponseList(ausencias: Ausencia[]): AusenciaResponse[] {
    return ausencias.map((ausencia) => this.toResponse(ausencia));
  }
}
