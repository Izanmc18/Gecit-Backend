import { Competencia } from '../entities/competencia.entity';

export class CompetenciaResponse {
  id: string;
  idEntidad: string;
  nombreCompetencia: string;
  totalUsuarios?: number;
}

export class CompetenciaAdapter {
  static toResponse(competencia: Competencia): CompetenciaResponse {
    return {
      id: competencia.id,
      idEntidad: competencia.idEntidad,
      nombreCompetencia: competencia.nombreCompetencia,
      totalUsuarios: competencia.usuarios?.length ?? undefined,
    };
  }

  static toResponseList(competencias: Competencia[]): CompetenciaResponse[] {
    return competencias.map((c) => this.toResponse(c));
  }
}
