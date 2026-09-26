import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CampeonatoModel } from '../../../../../models/campeonatoModel';
import { EmpresaRankingDto } from '../../../../../models/empresaRankingDto';
import { RodadaPontosDto } from '../../../../../models/rodadaPontosDto';

import { JogadorService } from '../../../../../services/jogador-service';

import { ApostasDetalhes } from './apostas-detalhes/apostas-detalhes';

@Component({
  selector: 'app-rank-detalhes',
  imports: [
    CommonModule
  ],
  templateUrl: './rank-detalhes.html',
  styleUrl: './rank-detalhes.css',
})
export class RankDetalhes implements OnInit {
  campeonato: CampeonatoModel = undefined as unknown as CampeonatoModel;
  rankJogador: EmpresaRankingDto = undefined as unknown as EmpresaRankingDto;

  listaRodada: RodadaPontosDto[] = undefined as unknown as RodadaPontosDto[];

  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private jogadorService: JogadorService,
             @Inject(MAT_DIALOG_DATA) public data: {
              campeonato: CampeonatoModel,
              rankJogador: EmpresaRankingDto;
             },
              public dialogRef: MatDialogRef<RankDetalhes>) {
    this.campeonato = this.data.campeonato;
    this.rankJogador = this.data.rankJogador;
  }

  ngOnInit(): void {
    this.jogadorService
        .jogadorRodadas(this.rankJogador.IdJogador, this.campeonato.IdCampeonato)
        .subscribe(dados => {
          this.listaRodada = dados;
          this.cdr.markForCheck();
        });
  }             

  fechar() {
    this.dialogRef.close();
  }

  verRodada(rodada: RodadaPontosDto) {
    this.dialog.open(ApostasDetalhes, {
      width: "726px",
      height: "400px",
      maxHeight: "400px",
      maxWidth: "726px",
      disableClose: true,
      data: {
        idCampeonato: this.campeonato.IdCampeonato,
        idJogador: this.rankJogador.IdJogador,
        rodada: rodada.Rodada
      }
    })    
  }
}