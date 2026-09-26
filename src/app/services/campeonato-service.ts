import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CampeonatoModel } from '../models/campeonatoModel';
import { CampeonatoRetornoModel } from '../models/campeonatoRetornoModel';

@Injectable({
  providedIn: 'root'
})
export class CampeonatoService {
    private urlBolao: string = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient
    ) {
    }

    gravar(campeonato: CampeonatoModel): Observable<CampeonatoRetornoModel[]> {
        return this.http.get<CampeonatoRetornoModel[]>(this.urlBolao + "campeonatoGravar/" +
                campeonato.IdCampeonato + "/" + campeonato.Nome + "/" + campeonato.Ano + "/" + campeonato.Ativo);
    }

    listaCampeonatos() {
        return this.http.get<CampeonatoModel[]>(this.urlBolao + "campeonatos");
    }

    timesDoCampeonato(idCampeonato: number) {
        return this.http.get<CampeonatoModel[]>(this.urlBolao + "timescampeonato/" + idCampeonato);
    }
}