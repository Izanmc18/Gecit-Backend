import { Cita, EstadoCita } from '../entities/cita.entity';

export class CitaResponse {
  id: string;
  clienteNombre: string;
  clienteApellidos: string;
  clienteDni: string;
  clienteEmail: string | null;
  clienteTelefono: string | null;
  idUsuarioAsignado: string;
  idMesa: string;
  idTramite: string;
  tramite?: any;
  fechaHora: Date;
  estado: EstadoCita;
  observaciones: string | null;
}

export class CitaAdapter {
  static toResponse(cita: Cita): CitaResponse {
    return {
      id: cita.id,
      clienteNombre: cita.clienteNombre,
      clienteApellidos: cita.clienteApellidos,
      clienteDni: cita.clienteDni,
      clienteEmail: cita.clienteEmail || null,
      clienteTelefono: cita.clienteTelefono || null,
      idUsuarioAsignado: cita.idUsuarioAsignado,
      idMesa: cita.idMesa,
      idTramite: cita.idTramite,
      tramite: cita.tramite ? { nombreTramite: cita.tramite.nombreTramite } : undefined,
      fechaHora: cita.fechaHora,
      estado: cita.estado,
      observaciones: cita.observaciones || null,
    };
  }

  static toResponseList(citas: Cita[]): CitaResponse[] {
    return citas.map((cita) => this.toResponse(cita));
  }
}
