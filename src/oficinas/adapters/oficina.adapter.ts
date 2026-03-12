import { Oficina } from '../entities/oficina.entity';

export class OficinaResponse {
  id: string;
  nombre: string;
  direccion: string | null;
  duracionCitaMinutos: number;
}

export class OficinaAdapter {
  static toResponse(oficina: Oficina): OficinaResponse {
    return {
      id: oficina.id,
      nombre: oficina.nombre,
      direccion: oficina.direccion || null,
      duracionCitaMinutos: oficina.duracionCitaMinutos,
    };
  }

  static toResponseList(oficinas: Oficina[]): OficinaResponse[] {
    return oficinas.map((oficina) => this.toResponse(oficina));
  }
}
