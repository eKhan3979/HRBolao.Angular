import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ApostaJogadorRodadaDto } from '../../../../../../models/apostaJogadorRodadaDto';

import { ApostaService } from '../../../../../../services/aposta-service';
import { NumericLiteral } from 'typescript';

@Component({
  selector: 'app-apostas-detalhes',
  imports: [
    CommonModule
  ],
  templateUrl: './apostas-detalhes.html',
  styleUrl: './apostas-detalhes.css',
})
export class ApostasDetalhes implements OnInit {
  idCampeonato: number = 0;
  idJogador: number = 0;
  rodada: number = 0;

  listaJogos: ApostaJogadorRodadaDto[] = undefined as unknown as ApostaJogadorRodadaDto[];

  constructor(private apostaService: ApostaService,
              private cdr: ChangeDetectorRef,
              private dialogRef: MatDialogRef<ApostasDetalhes>,
            @Inject(MAT_DIALOG_DATA) public data: {
              idJogador: number,
              idCampeonato: number,
              rodada: number
            }) {
    this.idJogador = this.data.idJogador;
    this.idCampeonato = this.data.idCampeonato;
    this.rodada = this.data.rodada;
  }

  fechar() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.apostaService
        .apostaJogadorRodada(this.idJogador, this.idCampeonato, this.rodada)
        .subscribe(dados => {
          this.listaJogos = dados;
          this.cdr.markForCheck();
        });
  }
}