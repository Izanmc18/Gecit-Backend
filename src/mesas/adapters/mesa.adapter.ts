import { Mesa } from '../entities/mesa.entity';

export class MesaResponse {
  id: string;
  idSala: string;
  nombreMesa: string;
  posX: number;
  posY: number;
  rotacion: number;
  ancho: number;
  largo: number;
  estado: string;
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
      ancho: mesa.ancho,
      largo: mesa.largo,
      estado: mesa.estado,
    };
  }

  static toResponseList(mesas: Mesa[]): MesaResponse[] {
    return mesas.map((mesa) => this.toResponse(mesa));
  }
}
