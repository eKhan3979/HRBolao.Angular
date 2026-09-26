import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from "@angular/router";

import { CampeonatoModel } from '../../../../models/campeonatoModel';
import { TimeIdDto } from '../../../../models/timeIdDto';
import { TimeModel } from '../../../../models/timeModel';
import { TimeNumeroModel } from '../../../../models/timeNumeroModel';

import { CampeonatoTimeService } from '../../../../services/campeonatoTimeService';

@Component({
  selector: 'app-times',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './times.html',
  styleUrl: './times.css',
})
export class Times {
  itens = [
    { name: 'Campeonato', path: '/Home/Campeonato' },
    { name: 'Empresa', path: '/Home/Empresa' },
    { name: 'Jogador', path: '/Home/Jogador' },
    { name: 'Time', path: '/Home/Time' },
  ]

  listaTimes: TimeNumeroModel[] = [];
  listaTimesAux: TimeModel[] = [];
  listaTimesDisponiveis: TimeIdDto[] = [];

  campeonato: CampeonatoModel = undefined as unknown as CampeonatoModel;
  //timeSelecionado: TimeIdDto = undefined as unknown as TimeIdDto;
  timeSelecionado: number = undefined as unknown as number;

  constructor(private campeonatoTimeService: CampeonatoTimeService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder) {
    this.campeonato = history.state.campeonato;
  }

  ngOnInit() {
    this.campeonatoTimeService.timesDoCampeonato(this.campeonato.IdCampeonato)
      .subscribe(dados => {
        this.listaTimesAux = dados;
        this.cdr.markForCheck(); 

        for (let i = 0; i < this.listaTimesAux.length; i++) {
          this.listaTimes.push({
            Numero: i + 1,
            IdTime: this.listaTimesAux[i].IdTime,
            Nome: this.listaTimesAux[i].Nome,
            UF: this.listaTimesAux[i].UF,
            Cidade: this.listaTimesAux[i].Cidade,
            Abreviatura: this.listaTimesAux[i].Abreviatura,
            Ativo: this.listaTimesAux[i].Ativo,
          })
        }
      });
      
      this.campeonatoTimeService.timesCampeonatoDisponiveis(this.campeonato.IdCampeonato)
        .subscribe(dados => {
          this.listaTimesDisponiveis = dados;
          this.cdr.markForCheck(); 
      });      
  }

  adicionar() {
    this.campeonatoTimeService
        .adicionarTime(this.campeonato.IdCampeonato, this.timeSelecionado)
        .subscribe(dados => {
            let retorno = dados;
            this.cdr.markForCheck();

            let index = this.listaTimesDisponiveis.findIndex(t => (t.IdTime == this.timeSelecionado));

            this.listaTimes.push({
              Numero: 0,
              IdTime: this.timeSelecionado,
              Nome: this.listaTimesDisponiveis[index].Nome,
              UF: "",
              Cidade: "",
              Abreviatura: "",
              Ativo: true
            })

            this.listaTimes.sort((a, b) => a.Nome.localeCompare(b.Nome));

            for (let item = 0; item < this.listaTimes.length; item++) {
              this.listaTimes[item].Numero = item + 1;
            }

            this.listaTimesDisponiveis.splice(index, 1);
        });
  }
}