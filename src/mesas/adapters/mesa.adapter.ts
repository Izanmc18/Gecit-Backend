import { Mesa } from '../entities/mesa.entity';

export class MesaResponse {
  id: string;
  idSala: string;
  nombreMesa: string;
  posX: number;
  posY: number;
  rotacion: number;
}

export class MesaAdapter {
  static toResponse(mesa: Mesa): MesaResponse {
    return {
      id: mesa.id,
      idSala: mesa.idSala,
      nombreMesa: mesa.nombreMesa,
      posX: mesa.posX,
      posY: mesa.posY,
      rotacion: mesa.rotacion,
    };
  }

  static toResponseList(mesas: Mesa[]): MesaResponse[] {
    return mesas.map((mesa) => this.toResponse(mesa));
  }
}
