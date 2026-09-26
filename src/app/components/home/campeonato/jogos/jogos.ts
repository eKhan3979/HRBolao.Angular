import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule, RouterOutlet } from "@angular/router";

import { CampeonatoModel } from '../../../../models/campeonatoModel';
import { CampeonatoJogoService } from '../../../../services/campeonatoJogo-service';
import { JogoDto } from '../../../../models/jogoDto';
import { JogoEditDto } from '../../../../models/jogoEditDto';
import { RodadaAtualDto } from '../../../../models/rodadaAtualDto';
import { RodadaDto } from '../../../../models/rodadaDto';
import { TimeIdDto } from '../../../../models/timeIdDto';

@Component({
  selector: 'app-jogos',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
],
  templateUrl: './jogos.html',
  styleUrl: './jogos.css',
})
export class Jogos implements OnInit {
  itens = [
    { name: 'Campeonato', path: '/Home/Campeonato' },
    { name: 'Empresa', path: '/Home/Empresa' },
    { name: 'Jogador', path: '/Home/Jogador' },
    { name: 'Time', path: '/Home/Time' },
  ]

  campeonato: CampeonatoModel = undefined as unknown as CampeonatoModel;

  formRodada: any;

  idTimeCasa: number = 0;
  idTimeVisitante: number = 0;

  jogoEdit: JogoEditDto = undefined as unknown as JogoEditDto;

  permitirNovaRodada: boolean = false;
  permitirNovoJogo: boolean = false;

  rodadaAtual: RodadaAtualDto = undefined as unknown as RodadaAtualDto;
  rodadaSelect: string = undefined as unknown as string;
  rodadaSelecionada: RodadaDto = undefined as unknown as RodadaDto;
  
  listaJogos: JogoDto[] = [];
  listaRodadas: RodadaDto[] = [];
  listaTimesDisponiveis: TimeIdDto[] = [];

  timeCasa: TimeIdDto = undefined as unknown as TimeIdDto;
  timeVisitante: TimeIdDto = undefined as unknown as TimeIdDto;

  constructor(private dialog: MatDialog,
              private campeonatoJogoService: CampeonatoJogoService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.campeonato = history.state.campeonato;

    this.formRodada = this.fb.group({
      RodadaSelecionada: ["", Validators.required],
      RodadaNovaCheck: [Boolean, Validators.required],
      RodadaNova: [0, Validators.required],
      RodadaNovaNome: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.jogoEdit = ({
      IdCampeonatoJogo: 0,
      DataJogo: new Date(),
      Hh_Mm: "",
      IdTimeCasa: 0,
      IdTimeVisitante: 0,
      TimeCasa: "",
      TimeVisitante: "",
      Rodada: 0,
      RodadaNome: ""
    });

    this.campeonatoJogoService.timesDoCampeonato(this.campeonato.IdCampeonato)
      .subscribe(dados => {
        const listaTimesAux = dados;
        this.cdr.markForCheck(); 

        for (let i = 0; i < listaTimesAux.length; i++) {
          this.listaTimesDisponiveis.push({
            IdTime: listaTimesAux[i].IdTime,
            Nome: listaTimesAux[i].Nome,
            Abreviatura: listaTimesAux[i].Abreviatura
          })
        }
      });

    this.campeonatoJogoService.campeonatoRodadas(this.campeonato.IdCampeonato)
      .subscribe(dados => {
        const rodadas = dados;
        this.cdr.markForCheck(); 

        rodadas.push({
          Rodada: 0,
          RodadaNome: ""
        });

        rodadas.sort((a, b) => a.Rodada - b.Rodada);

        this.listaRodadas = rodadas;    
      });

    this.campeonatoJogoService.rodadaAtual(this.campeonato.IdCampeonato)
      .subscribe(dados => {
        this.rodadaAtual = dados[0];
        let index = this.listaRodadas.findIndex(t => t.Rodada == this.rodadaAtual.RodadaAtual);
        this.cdr.markForCheck(); 

        if (index > -1)
        {
          this.rodadaSelecionada = this.listaRodadas[index];
          this.rodadaSelect = this.rodadaSelecionada.RodadaNome;
        }
        else if (this.listaRodadas.length > 1)
        {
          this.rodadaSelecionada = this.listaRodadas[1];
          this.rodadaSelect = this.rodadaSelecionada.RodadaNome;
        }
        else
        {
          this.rodadaSelecionada = {
            Rodada: 0,
            RodadaNome: ""
          };
          this.rodadaSelect = "";
        }
      });
  }

  excluirJogo(jogo: JogoDto) {
    this.campeonatoJogoService.jogoExcluir(jogo.IdCampeonatoJogo)
        .subscribe(dados => {
          this.cdr.markForCheck(); 
          this.listaJogos = this.listaJogos.filter(t => t.IdCampeonatoJogo != jogo.IdCampeonatoJogo);
          if (this.listaJogos.length == 0) {
            this.listaRodadas = this.listaRodadas.filter(t => t.RodadaNome != this.rodadaSelecionada.RodadaNome);
            this.rodadaSelecionada.Rodada = 0;
            this.rodadaSelecionada.RodadaNome = "";
          }
          this.snackBar.open('Jogo excluído !', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'});
        }); 
  }

  gravarResultado(jogo: JogoDto) {
    const fim: number = (jogo.Finalizado ? 1 : 0);

    this.campeonatoJogoService.jogoResultado(jogo.IdCampeonatoJogo, jogo.GolsTimeCasa, jogo.GolsTimeVisitante, fim)
        .subscribe(dados => {
          this.cdr.markForCheck();
          if (dados == 1)
            this.snackBar.open('Resultado gravado !', 'Fechar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'});
        });
  }

  incluirJogo() {
    let yyyy_Mm_Dd = this.jogoEdit.DataJogo.toLocaleString('pt-BR');

    let rodada: RodadaDto = {
      Rodada: this.jogoEdit.Rodada,
      RodadaNome: this.jogoEdit.RodadaNome
    }

    if ((rodada.Rodada == undefined) ||
        (rodada.Rodada == 0)) {
      let index = this.listaRodadas.findIndex(t => t.RodadaNome == this.rodadaSelecionada.RodadaNome);

      rodada.Rodada = this.listaRodadas[index].Rodada;
      rodada.RodadaNome = this.listaRodadas[index].RodadaNome;
    }

    this.campeonatoJogoService.jogoInsert(this.campeonato.IdCampeonato, rodada.Rodada, rodada.RodadaNome, yyyy_Mm_Dd, this.jogoEdit.Hh_Mm, this.timeCasa.IdTime, this.timeVisitante.IdTime)
        .subscribe(dados => {
          let idCampeonatoJogo = dados.IdCampeonatoJogo;

          this.cdr.markForCheck(); 

          this.listaJogos.push({
            IdCampeonatoJogo: idCampeonatoJogo,
            Yyyy_Mm_Dd: yyyy_Mm_Dd,
            Hh_Mm: this.jogoEdit.Hh_Mm,
            IdTimeCasa: this.timeCasa.IdTime,
            TimeCasa: this.timeCasa.Nome,
            GolsTimeCasa: 0,
            IdTimeVisitante: this.timeVisitante.IdTime,
            TimeVisitante: this.timeVisitante.Nome,
            GolsTimeVisitante: 0,
            PenaltisTimeCasa: 0,
            PenaltisTimeVisitante: 0,
            MataMata: false,
            Prorrogacao: false,
            DisputaPenaltis: false,
            Finalizado: false,
            Adiado: false,
            Cancelado: false
          });

          this.rodadaSelecionada.Rodada = rodada.Rodada;
          this.rodadaSelecionada.RodadaNome = rodada.RodadaNome;

          this.jogoEdit.IdCampeonatoJogo = 0,
          this.jogoEdit.IdTimeCasa = 0,
          this.jogoEdit.IdTimeVisitante = 0,
          //this.jogoEdit.Rodada = 0,
          //this.jogoEdit.RodadaNome = "",
          this.jogoEdit.TimeCasa = "",
          this.jogoEdit.TimeVisitante = "";

          this.timeCasa = {
            IdTime: 0,
            Nome: "",
            Abreviatura: ""
          };
          this.timeVisitante = {
            IdTime: 0,
            Nome: "",
            Abreviatura: ""
          };
          this.idTimeCasa = 0;
          this.idTimeVisitante = 0;
          this.permitirNovaRodada = false;

          this.snackBar.open('Jogo cadastrado !', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'});
        });
  }

  jogos(){
    let index = this.listaRodadas.findIndex(t => t.RodadaNome == this.rodadaSelect);

    this.campeonatoJogoService.jogosDaRodada(this.campeonato.IdCampeonato, this.listaRodadas[index].Rodada)
      .subscribe((dados: any) => {
        const retorno: any = dados;
        this.cdr.markForCheck(); 
        this.listaJogos = retorno[0] as JogoDto[] || [];
        this.permitirNovoJogo = true;
      });
  }

  novaRodada() {
    this.listaJogos = [];
    this.permitirNovaRodada = true;
    this.permitirNovoJogo = true;
  }  
}