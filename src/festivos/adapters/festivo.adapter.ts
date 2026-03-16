import { Festivo } from '../entities/festivo.entity';

export class FestivoResponse {
  id: string;
  idOficina: string;
  fecha: string;
  descripcion: string | null;
}

export class FestivoAdapter {
  static toResponse(festivo: Festivo): FestivoResponse {
    return {
      id: festivo.id,
      idOficina: festivo.idOficina,
      fecha: festivo.fecha,
      descripcion: festivo.descripcion || null,
    };
  }

  static toResponseList(festivos: Festivo[]): FestivoResponse[] {
    return festivos.map((festivo) => this.toResponse(festivo));
  }
}
