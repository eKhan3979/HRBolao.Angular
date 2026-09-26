import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CampeonatoTimeRetorno } from '../models/campeonatoTimeRetorno';
import { TimeModel } from '../models/timeModel';
import { TimeRetornoModel } from '../models/timeRetornoModel';

@Injectable({
  providedIn: 'root'
})
export class CampeonatoTimeService {
    private urlBolao: string = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) {
    }

    adicionarTime(idCampeonato: number, idTime: number) {
        return this.http.get<CampeonatoTimeRetorno[]>(this.urlBolao + "campeonatoTimeInsert/" + idCampeonato + "/" + idTime);
    }

    timesDoCampeonato(idCampeonato: number) {
        return this.http.get<TimeModel[]>(this.urlBolao + "timescampeonato/" + idCampeonato);
    }

    timesCampeonatoDisponiveis(idCampeonato: number) {
        return this.http.get<TimeModel[]>(this.urlBolao + "timescampeonatodisponiveis/" + idCampeonato);
    }
}