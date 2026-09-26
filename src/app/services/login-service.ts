import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JogadorModel } from '../models/jogadorModel';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private urlBolao: string = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    private http = inject(HttpClient);

    login(email: string, senha: string) {
        const usuario = {
            email: email,
            senha: senha
        };

        return this.http.get<JogadorModel[]>(this.urlBolao + "loginToken/" + email + "/" + senha);
    }
}