import { Tramite } from '../entities/tramite.entity';

export class TramiteResponse {
  id: string;
  idEntidad: string;
  nombreTramite: string;
  descripcion: string | null;
  idCompetenciaRequerida: string | null;
}

export class TramiteAdapter {
  static toResponse(tramite: Tramite): TramiteResponse {
    return {
      id: tramite.id,
      idEntidad: tramite.idEntidad,
      nombreTramite: tramite.nombreTramite,
      descripcion: tramite.descripcion || null,
      idCompetenciaRequerida: tramite.idCompetenciaRequerida || null,
    };
  }

  static toResponseList(tramites: Tramite[]): TramiteResponse[] {
    return tramites.map((tramite) => this.toResponse(tramite));
  }
}
