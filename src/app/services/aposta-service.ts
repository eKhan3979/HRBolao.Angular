import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApostaJogadorRodadaDto } from '../models/apostaJogadorRodadaDto';
import { ApostaPontosRodadaDto } from '../models/apostaPontosRodadaDto';

@Injectable({
  providedIn: 'root'
})
export class ApostaService {
    private urlBolao: string = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient
    ) {
    }

    apostaJogadorRodada(idJogador: number, idCampeonato: number, rodada: number) {
        return this.http.get<ApostaJogadorRodadaDto[]>(this.urlBolao + "apostasJogadorRodada/" + idJogador + "/" + idCampeonato + "/" + rodada);
    }

    apostaPontosRodada(idJogador: number, idCampeonato: number, rodada: number) {
        return this.http.get<ApostaPontosRodadaDto[]>(this.urlBolao + "jogadorPontosRodada/" + idJogador + "/" + idCampeonato + "/" + rodada);
    }

}