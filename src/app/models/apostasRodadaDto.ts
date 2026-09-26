export interface ApostasRodadaDto {
    IdCampeonatoJogo: number;
    Yyyy_Mm_Dd: string;
    Hh_Mm: string;
    IdTimeCasa: number;
    TimeCasa: string;
    GolsTimeCasa: number;
    IdTimeVisitante: number;
    TimeVisitante: string;
    GolsTimeVisitante: number;
    PenaltisTimeCasa: number;
    PenaltisTimeVisitante: number;
    MataMata: boolean;
    Prorrogacao: boolean;
    DisputaPenaltis: boolean;
    Finalizado: boolean;
    Adiado: boolean;
    Cancelado: boolean;
    IdAposta: number;
    GolsApostaTimeCasa: number;
    GolsApostaTimeVisitante: number;
}