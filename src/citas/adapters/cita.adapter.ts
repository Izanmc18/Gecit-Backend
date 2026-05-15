import { Cita, EstadoCita } from '../entities/cita.entity';

export class CitaResponse {
  id: string;
  clienteNombre: string;
  clienteApellidos: string;
  clienteDni: string;
  clienteEmail: string | null;
  clienteTelefono: string | null;
  idUsuarioAsignado: string;
  usuarioAsignado?: any;
  idMesa: string;
  mesa?: any;
  idSala: string;
  sala?: any;
  idTramite: string;
  tramite?: any;
  fechaHora: Date;
  estado: EstadoCita;
  observaciones: string | null;
  turnoLlegada?: any;
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
      usuarioAsignado: cita.usuarioAsignado
        ? { nombre: cita.usuarioAsignado.nombre }
        : undefined,
      idMesa: cita.idMesa,
      mesa: cita.mesa ? { nombreMesa: cita.mesa.nombreMesa } : undefined,
      idSala: cita.idSala,
      sala: (cita.sala || (cita.mesa && cita.mesa.sala))
        ? { nombreSala: (cita.sala ? cita.sala.nombreSala : cita.mesa.sala.nombreSala) }
        : undefined,
      idTramite: cita.idTramite,
      tramite: cita.tramite
        ? { nombreTramite: cita.tramite.nombreTramite }
        : undefined,
      fechaHora: cita.fechaHora,
      estado: cita.estado,
      observaciones: cita.observaciones || null,
      turnoLlegada: cita.turnoLlegada
        ? {
            id: cita.turnoLlegada.id,
            codigoTicket: cita.turnoLlegada.codigoTicket,
            estado: cita.turnoLlegada.estado,
          }
        : undefined,
    };
  }

  static toResponseList(citas: Cita[]): CitaResponse[] {
    return citas.map((cita) => this.toResponse(cita));
  }
}
