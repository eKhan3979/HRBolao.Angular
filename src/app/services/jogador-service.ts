import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApostasRodadaDto } from '../models/apostasRodadaDto';
import { CampeonatoModel } from '../models/campeonatoModel';
import { CampeonatoRanking } from '../models/campeonatoRankingDto';
import { JogadorModel } from '../models/jogadorModel';
import { RodadaPontosDto } from '../models/rodadaPontosDto';

@Injectable({
    providedIn: 'root'
})
export class JogadorService {
    private urlBolao: string = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient
    ) {}

    apostasDaRodada(idCampeonato: number,
                    idJogador: number,
                    rodada: number) {
        return this.http.get<[ApostasRodadaDto]>(this.urlBolao + "apostasDaRodada/" + idCampeonato + "/" + idJogador + "/" + rodada);
    }

    campeonatosDaEmpresa(idEmpresa: number) {
        return this.http.get<CampeonatoModel[]>(this.urlBolao + "campeonatosDaEmpresa/" + idEmpresa);
    }

    empresaCampeonatoRanking(idEmpresa: number, idCampeonato: number) {
        return this.http.get<CampeonatoRanking[]>(this.urlBolao + "empresaRanking/" + idEmpresa + "/" + idCampeonato);
    }

    jogadorGravar(jogador: JogadorModel) {
        if (jogador.IdJogador == 0) {
            return this.http.get<[]>(this.urlBolao + "jogadorGravar/" + jogador.IdJogador + "/" + jogador.IdEmpresa + "/" + jogador.NomeApelido + "/1234/" + jogador.email);
        } else {
            return this.http.get<[]>(this.urlBolao + "jogadorGravar/" + jogador.IdJogador + "/" + jogador.IdEmpresa + "/" + jogador.NomeApelido + "/" + jogador.Senha + "/" + jogador.email);
        }
    }

    jogadorListaEmpresa(idEmpresa: number) {
        return this.http.get<JogadorModel[]>(this.urlBolao + "jogadorListaEmpresa/" + idEmpresa);
    }

    jogadorLogin(idEmpresa: number, nomeApelido: string, senha: string) {
        return this.http.get(this.urlBolao + "jogadorLogin/" + idEmpresa + "/" + nomeApelido + "/" + senha);
    }

    jogadorRodadas(idJogador: number, idCampeonato: number) {
        return this.http.get<RodadaPontosDto[]>(this.urlBolao + "apostasJogadorCampeonato/" + idJogador + "/" + idCampeonato);
    }
}