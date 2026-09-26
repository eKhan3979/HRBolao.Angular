import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { JogoInsertDto } from '../models/jogoInsertDto';
import { RodadaAtualDto } from '../models/rodadaAtualDto';
import { RodadaDto } from '../models/rodadaDto';
import { TimeModel } from '../models/timeModel';

@Injectable({
  providedIn: 'root'
})
export class CampeonatoJogoService {
    private urlBolao: string = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) {
    }

    campeonatoRodadas(idCampeonato: number) {
        return this.http.get<RodadaDto[]>(this.urlBolao + "campeonatoRodadas/" + idCampeonato);
    }

    jogoExcluir(idCampeonatoJogo: number) {
        return this.http.get(this.urlBolao + "jogoExcluir/" + idCampeonatoJogo);
    }

    jogoInsert(idCampeonato: number, rodada: number, rodadaNome: string, yyyy_Mm_Dd: string, hh_Mm: string, idTimeCasa: number, idTimeVisitante: number) {
        return this.http.get<JogoInsertDto>(this.urlBolao + "jogoInsert/" + idCampeonato + "/" + rodada + "/" + rodadaNome + "/" + yyyy_Mm_Dd + "/" + hh_Mm + "/" + idTimeCasa + "/" + idTimeVisitante);
    }

    jogoResultado(idCampeonatoJogo: number, golsTimeCasa: number, golsTimeVisitante: number, finalizado: number) {
        return this.http.get<number>(this.urlBolao + "jogoResultado/" + idCampeonatoJogo + "/" + golsTimeCasa + "/" + golsTimeVisitante + "/" +  finalizado);
    }

    jogosDaRodada(idCampeonato: number, rodada: number) {
        return this.http.get<object[]>(this.urlBolao + "jogosDaRodada/" + idCampeonato + "/" + rodada);
    }

    rodadaAtual(idCampeonato: number) {
        return this.http.get<RodadaAtualDto[]>(this.urlBolao + "rodadaAtual/" + idCampeonato);
    }

    timesDoCampeonato(idCampeonato: number) {
        return this.http.get<TimeModel[]>(this.urlBolao + "timescampeonato/" + idCampeonato);
    }
}