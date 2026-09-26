import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TimeModel } from '../models/timeModel';
import { TimeRetornoModel } from '../models/timeRetornoModel';

@Injectable({
    providedIn: 'root'
})
export class TimeService {
    private urlBolao: string = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) {

    }

    gravar(time: TimeModel) {
        let abreviatura = ((time.Abreviatura.length > 0) ? time.Abreviatura : "-");
        let ativo = ((time.Ativo) ? 1 : 0);
        let cidade = ((time.Cidade.length > 0) ? time.Cidade : "-");
        let uf = ((time.UF.length > 0) ? time.UF : "-");

        return this.http.get<TimeRetornoModel[]>(this.urlBolao + "timeGravar/" + time.IdTime + "/" + time.Nome + "/" + uf + "/" + cidade + "/" + ativo + "/" + abreviatura + "/" + time.Tipo);
    }

    listaTimes() {
        return this.http.get<TimeModel[]>(this.urlBolao + "timesLista");
    }
}