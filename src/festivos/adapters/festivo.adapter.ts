import { Festivo } from '../entities/festivo.entity';

export class FestivoResponse {
  id: string;
  idEntidad: string;
  fecha: string;
  descripcion: string | null;
}

export class FestivoAdapter {
  static toResponse(festivo: Festivo): FestivoResponse {
    return {
      id: festivo.id,
      idEntidad: festivo.idEntidad,
      fecha: festivo.fecha,
      descripcion: festivo.descripcion || null,
    };
  }

  static toResponseList(festivos: Festivo[]): FestivoResponse[] {
    return festivos.map((festivo) => this.toResponse(festivo));
  }
}
