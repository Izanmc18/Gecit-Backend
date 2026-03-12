import { Tramite } from '../entities/tramite.entity';

export class TramiteAdapter {
  static toResponse(tramite: Tramite) {
    return {
      id: tramite.id,
      nombreTramite: tramite.nombreTramite,
    };
  }

  static toResponseList(tramites: Tramite[]) {
    return tramites.map((tramite) => this.toResponse(tramite));
  }
}
