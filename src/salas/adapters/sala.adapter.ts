import { Sala } from '../entities/sala.entity';

export class SalaResponse {
  id: string;
  idOficina: string;
  nombreSala: string;
}

export class SalaAdapter {
  static toResponse(sala: Sala): SalaResponse {
    return {
      id: sala.id,
      idOficina: sala.idOficina,
      nombreSala: sala.nombreSala,
    };
  }

  static toResponseList(salas: Sala[]): SalaResponse[] {
    return salas.map((sala) => this.toResponse(sala));
  }
}
