import { Mesa } from '../entities/mesa.entity';

export class MesaResponse {
  id: string;
  idSala: string;
  nombreMesa: string;
}

export class MesaAdapter {
  static toResponse(mesa: Mesa): MesaResponse {
    return {
      id: mesa.id,
      idSala: mesa.idSala,
      nombreMesa: mesa.nombreMesa,
    };
  }

  static toResponseList(mesas: Mesa[]): MesaResponse[] {
    return mesas.map((mesa) => this.toResponse(mesa));
  }
}
