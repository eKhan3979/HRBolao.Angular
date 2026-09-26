import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CampeonatoModel } from '../../../../../../models/campeonatoModel';
import { RodadaPontosDto } from '../../../../../../models/rodadaPontosDto';

import { ApostaService } from '../../../../../../services/aposta-service';
import { JogadorService } from '../../../../../../services/jogador-service';

import { ApostaPontosRodadaDto } from '../../../../../../models/apostaPontosRodadaDto';
import { CdkAriaLive } from '../../../../../../../../node_modules/@angular/cdk/types/_a11y-module-chunk';

@Component({
  selector: 'app-apostas-rodada',
  imports: [
    CommonModule,
    FormsModule
],
  templateUrl: './apostas-rodada.html',
  styleUrl: './apostas-rodada.css',
})
export class ApostasRodada implements OnInit {
  campeonato: CampeonatoModel = undefined as unknown as CampeonatoModel;
  idJogador: number = 0;
  listaApostas: ApostaPontosRodadaDto[] = undefined as unknown as ApostaPontosRodadaDto[];
  rodada: RodadaPontosDto = undefined as unknown as RodadaPontosDto;  
  totalDePontos: number = 0;

  constructor(private apostaService: ApostaService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private verDetalhes: MatDialog,
             @Inject(MAT_DIALOG_DATA) public data: {
                campeonato: CampeonatoModel,
                idJogador: number,
                rodada: RodadaPontosDto
              },
              public dialogRef: MatDialogRef<ApostasRodada>) {
    this.campeonato = this.data.campeonato;
    this.idJogador = this.data.idJogador;
    this.rodada = this.data.rodada;
  }

  ngOnInit(): void {
    this.apostaService
        .apostaPontosRodada(this.idJogador,
                            this.campeonato.IdCampeonato,
                            this.rodada.Rodada)
        .subscribe(dados => {
          let lista = dados;

          let totalDePontos = 0;

          lista.forEach(element => {
            if (element.Finalizado) {
              element.Resultado = element.GolsTimeCasa.toString() + " x " + element.GolsTimeVisitante.toString();
              totalDePontos += element.Pontos;
            }
          });

          this.totalDePontos = totalDePontos;
          this.listaApostas = lista;

          this.cdr.markForCheck();
        });
  }

  fechar(): void {
    this.dialogRef.close();
  }
}