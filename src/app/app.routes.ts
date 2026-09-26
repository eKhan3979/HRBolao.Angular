import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Campeonato } from './components/home/campeonato/campeonato';
import { Times } from './components/home/campeonato/times/times';
import { Jogos } from './components/home/campeonato/jogos/jogos';
import { Empresa } from './components/home/empresa/empresa';
import { Jogador } from './components/home/jogador/jogador';
import { JogadorRanking } from './components/home/jogador/jogador-ranking/jogador-ranking';
import { Time } from './components/home/time/time';

export const routes: Routes = [
    { path: 'Login', component: Login },
    { path: 'Home', component: Home },
    { path: 'Home/Campeonato', component: Campeonato },
    { path: 'Home/Campeonato/Times', component: Times },
    { path: 'Home/Campeonato/Jogos', component: Jogos },
    { path: 'Home/Empresa', component: Empresa },
    { path: 'Home/Jogador', component: Jogador },
    { path: 'Home/Jogador/JogadorRanking', component: JogadorRanking },
    { path: 'Home/Time', component: Time },
];