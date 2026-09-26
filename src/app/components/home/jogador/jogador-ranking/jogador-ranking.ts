import { ChangeDetectorRef, Component, Inject, numberAttribute, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule, RouterOutlet } from "@angular/router";

import { CampeonatoModel } from '../../../../models/campeonatoModel';
import { CampeonatoRanking } from '../../../../models/campeonatoRankingDto';
import { Detalhes } from './detalhes/detalhes';
import { EmpresaModel } from '../../../../models/empresaModel';
import { JogadorService } from '../../../../services/jogador-service';

@Component({
  selector: 'app-jogador-ranking',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './jogador-ranking.html',
  styleUrl: './jogador-ranking.css',
})
export class JogadorRanking implements OnInit {
    itens = [
      { name: 'Campeonato', path: '/Home/Campeonato' },
      { name: 'Empresa', path: '/Home/Empresa' },
      { name: 'Jogador', path: '/Home/Jogador' },
      { name: 'Time', path: '/Home/Time' },
    ]  

    empresa: EmpresaModel = undefined as unknown as EmpresaModel;
    campeonato: CampeonatoModel = undefined as unknown as CampeonatoModel;

    listaRanking: CampeonatoRanking[] = undefined as unknown as CampeonatoRanking[];
    listaRankingTotal: CampeonatoRanking[] = undefined as unknown as CampeonatoRanking[];

    rankingDetalhes: CampeonatoRanking = undefined as unknown as CampeonatoRanking;

    constructor(private jogadorService: JogadorService,
                private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                private verDetalhes: MatDialog,
               @Inject(MAT_DIALOG_DATA) public data: {
                campeonato: CampeonatoModel,
                empresa: EmpresaModel
               }, 
                public dialogRef: MatDialogRef<JogadorRanking>) {
      this.empresa = this.data.empresa;
      this.campeonato = this.data.campeonato;
    }

    ngOnInit(): void {
      this.jogadorService
          .empresaCampeonatoRanking(this.empresa.IdEmpresa, this.campeonato.IdCampeonato)
          .subscribe(dados => {
              this.listaRankingTotal = dados;
              this.cdr.markForCheck();

              this.listaRankingTotal.sort((a, b) => 
                  a.NomeApelido.localeCompare(b.NomeApelido) ||
                  a.Rodada - b.Rodada
              );

              let lista: CampeonatoRanking[] = [];
              let jogador = this.listaRankingTotal[0];
              let total = 0;

              for (let index = 0; index < this.listaRankingTotal.length; index++) {
                  lista.push({
                    NomeApelido: this.listaRankingTotal[index].NomeApelido,
                    Pontos: this.listaRankingTotal[index].Pontos,
                    Rodada: 0,
                    IdJogador: this.listaRankingTotal[index].IdJogador
                  });
              }

              this.listaRanking = lista;
          });
    }

    detalhes(ranking: CampeonatoRanking): void {
      this.verDetalhes.open(Detalhes, {
          width: '358px',
          height: '540px',
          disableClose: true,
          data: {
            empresa: this.empresa,
            campeonato: this.campeonato,
            ranking: ranking
          }
        }
      );
    }

    fechar() {
      this.verDetalhes.closeAll();
    }
}