import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EmpresaModel } from '../models/empresaModel';

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {
    private urlBolao: string = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) {}

    listaEmpresas() {
        return this.http.get<EmpresaModel[]>(this.urlBolao + "empresas");
    }
}