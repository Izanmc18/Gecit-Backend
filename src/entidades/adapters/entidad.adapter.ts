import { Entidad } from '../entities/entidad.entity';

export class EntidadAdapter {
  static toResponse(entidad: Entidad) {
    return {
      id: entidad.id,
      nombre: entidad.nombre,
      cif: entidad.cif,
      dominio: entidad.dominio,
      duracionCitaMinutos: entidad.duracionCitaMinutos,
      activo: entidad.activo,
      fechaCreacion: entidad.fechaCreacion,
    };
  }
}
