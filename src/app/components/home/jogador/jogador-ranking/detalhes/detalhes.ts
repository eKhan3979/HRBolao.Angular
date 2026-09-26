import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CampeonatoModel } from '../../../../../models/campeonatoModel';
import { CampeonatoRanking } from '../../../../../models/campeonatoRankingDto';
import { EmpresaModel } from '../../../../../models/empresaModel';
import { RodadaPontosDto } from '../../../../../models/rodadaPontosDto';

import { JogadorService } from '../../../../../services/jogador-service';

import { ApostasRodada } from './apostas-rodada/apostas-rodada';

@Component({
  selector: 'app-detalhes',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './detalhes.html',
  styleUrl: './detalhes.css',
})
export class Detalhes implements OnInit {
  campeonato: CampeonatoModel = undefined as unknown as CampeonatoModel;
  empresa: EmpresaModel = undefined as unknown as EmpresaModel;
  listaRodadas: RodadaPontosDto[] = undefined as unknown as RodadaPontosDto[];
  ranking: CampeonatoRanking = undefined as unknown as CampeonatoRanking;
  totalPontos: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      empresa: EmpresaModel,
      campeonato: CampeonatoModel,
      ranking: CampeonatoRanking
    },
    private jogadorService: JogadorService,
    private cdr: ChangeDetectorRef,
    private verApostasRodada: MatDialog,
    public dialogRef: MatDialogRef<Detalhes>) {
      this.empresa = this.data.empresa;
      this.campeonato = this.data.campeonato;
      this.ranking = this.data.ranking;
    }

  ngOnInit(): void {
    this.jogadorService.jogadorRodadas(this.ranking.IdJogador, this.campeonato.IdCampeonato)
        .subscribe(dados => {
          let lista = dados;

          this.cdr.markForCheck();

          if ((lista != undefined) && (lista.length > 0)) {
            let rodadaIni = lista[0].Rodada;
            let rodadaFim = lista[lista.length - 1].Rodada;
            let rodada = rodadaIni;
            let lista2 = [] as RodadaPontosDto[];
            let i = 0;
            let pontos = 0;
  
            while (rodada <= rodadaFim) {
              if (lista[i].Rodada == rodada) {
                lista2.push({
                  Rodada: lista[i].Rodada,
                  RodadaNome: lista[i].RodadaNome,
                  RodadaStr: lista[i].Rodada.toString(),
                  Pontos: lista[i].Pontos
                });
                pontos += lista[i].Pontos;
                i++;
              } else {
                lista2.push({ 
                  Rodada: rodada,
                  RodadaNome: rodada.toString(),
                  RodadaStr: rodada.toString(),
                  Pontos: 0 });
              }
              rodada++;
            }

            this.totalPontos = pontos;

            /*
            lista2.push({ 
              Rodada: rodadaFim + 1,
              RodadaNome: "Total:",
              RodadaStr: "Total",
              Pontos: pontos
            });
            */

            this.listaRodadas = lista2;
          } else {
            this.listaRodadas = lista;
          }          
        });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  jogosRodada(rodada: number): void {
    let rodadaIndex = this.listaRodadas.findIndex(t => t.Rodada == rodada);

    this.verApostasRodada.open(ApostasRodada, {
        width: '720px',
        height: '570px',
        maxWidth: '720px',
        maxHeight: '570px',
        panelClass: 'fullscreen-dialog',        
        disableClose: true,
        data: {
          campeonato: this.campeonato,
          idJogador: this.ranking.IdJogador,
          rodada: this.listaRodadas[rodadaIndex]
        }
      }
    );
  }
}