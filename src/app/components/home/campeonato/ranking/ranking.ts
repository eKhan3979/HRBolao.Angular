import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CampeonatoModel } from '../../../../models/campeonatoModel';
import { EmpresaModel } from '../../../../models/empresaModel';
import { EmpresaRankingDto } from '../../../../models/empresaRankingDto';

import { CampeonatoRankingService } from '../../../../services/campeonatoRankingService';

import { RankDetalhes } from './rank-detalhes/rank-detalhes';

@Component({
  selector: 'app-ranking',
  imports: [
    CommonModule
  ],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class Ranking implements OnInit {
  campeonato: CampeonatoModel = undefined as unknown as CampeonatoModel;
  empresa: EmpresaModel = undefined as unknown as EmpresaModel;

  listaRanking: EmpresaRankingDto[] = undefined as unknown as EmpresaRankingDto[];

  constructor(private cdr: ChangeDetectorRef,
              private campeonatoRankingService: CampeonatoRankingService,
              private dialog: MatDialog,
             @Inject(MAT_DIALOG_DATA) public data: {
                campeonato: CampeonatoModel,
                empresa: EmpresaModel
              }, 
              public dialogRef: MatDialogRef<Ranking>) {
    this.campeonato = this.data.campeonato;
    this.empresa = this.data.empresa;
  }

  ngOnInit(): void {
    this.campeonatoRankingService
        .empresaRanking(this.empresa.IdEmpresa, this.campeonato.IdCampeonato)
        .subscribe(dados => {
          let lista = dados;

          for (let index = 0; index < lista.length; index++) {
            lista[index].Posicao = index + 1;
          }

          this.listaRanking = lista;
          this.cdr.markForCheck();
        });
  }

  fechar() {
    this.dialogRef.close();
  }

  rankDetalhes(rank: EmpresaRankingDto) {
    this.dialog.open(RankDetalhes, {
      width: "249px",
      height: "400px",
      maxWidth: "249px",
      disableClose: true,
      data: {
        campeonato: this.campeonato,
        rankJogador: rank
      }
    })
  }
}