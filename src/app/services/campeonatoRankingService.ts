import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CampeonatoModel } from '../models/campeonatoModel';
import { CampeonatoRanking } from '../models/campeonatoRankingDto';
import { EmpresaRankingDto } from '../models/empresaRankingDto';

@Injectable({
  providedIn: 'root'
})
export class CampeonatoRankingService {
    private urlBolao: string = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) {
    }

    empresaRanking(idEmpresa: number, idCampeonato: number): Observable<EmpresaRankingDto[]> {
        return this.http.get<EmpresaRankingDto[]>(this.urlBolao + "empresaRanking/" + idEmpresa + "/" + idCampeonato);
    }
}