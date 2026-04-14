import { Sala } from '../entities/sala.entity';

export class SalaResponse {
  id: string;
  idEntidad: string;
  nombreSala: string;
  canvasWidth: number;
  canvasHeight: number;
  colorFondo: string;
}

export class SalaAdapter {
  static toResponse(sala: Sala): SalaResponse {
    return {
      id: sala.id,
      idEntidad: sala.idEntidad,
      nombreSala: sala.nombreSala,
      canvasWidth: sala.canvasWidth,
      canvasHeight: sala.canvasHeight,
      colorFondo: sala.colorFondo,
    };
  }

  static toResponseList(salas: Sala[]): SalaResponse[] {
    return salas.map((sala) => this.toResponse(sala));
  }
}
