export interface JogoDto {
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
    MataMata: Boolean;
    Prorrogacao: Boolean;
    DisputaPenaltis: Boolean;
    Finalizado: Boolean;
    Adiado: Boolean;
    Cancelado: Boolean;
}