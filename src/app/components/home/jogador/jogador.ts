import { ChangeDetectorRef, Component, numberAttribute, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule, RouterOutlet } from "@angular/router";

import { CampeonatoModel } from '../../../models/campeonatoModel';
import { EmpresaModel } from '../../../models/empresaModel';
import { JogadorIdDto } from '../../../models/JogadorIdDto';
import { JogadorModel } from '../../../models/jogadorModel';

import { EmpresaService } from '../../../services/empresa-service';
import { JogadorService } from '../../../services/jogador-service';

import { JogadorRanking } from '../jogador/jogador-ranking/jogador-ranking';

@Component({
  selector: 'app-jogador',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './jogador.html',
  styleUrl: './jogador.css',
})
export class Jogador implements OnInit{
  itens = [
      { name: 'Campeonato', path: '/Home/Campeonato' },
      { name: 'Empresa', path: '/Home/Empresa' },
      { name: 'Jogador', path: '/Home/Jogador' },
      { name: 'Time', path: '/Home/Time' },
    ]  

  formulario: any;

  empresaSelecionada: string = undefined as unknown as string;
  campeonatoSelecionado: string = undefined as unknown as string;

  jogadorEdit: JogadorModel = undefined as unknown as JogadorModel;

  listaCampeonatos: CampeonatoModel[] = undefined as unknown as CampeonatoModel[];
  listaEmpresas: EmpresaModel[] = undefined as unknown as EmpresaModel[];
  listaJogadores: JogadorModel[] = undefined as unknown as JogadorModel[];

  constructor(private jogadorService: JogadorService,
              private empresaService: EmpresaService,
              private matDialog: MatDialog,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private router: Router) {
      this.jogadorEdit = {
        IdJogador: 0,
        Ativo: true,
        DataCadastro: new Date(),
        email: "",
        IdEmpresa: 0,
        NomeApelido: "",
        Senha: ""
      };
  }

  ngOnInit(): void {
    this.empresaService.listaEmpresas()
        .subscribe((dados: EmpresaModel[]) => {
            let lista = dados;
            this.cdr.markForCheck();

            lista.unshift({ IdEmpresa: 0, NomeEmpresa: "", DataCadastro: new Date(), Ativo: true});
            this.listaEmpresas = lista;
            this.empresaSelecionada = lista[0].NomeEmpresa;
          });
  }

  gravar() {
    let index = this.listaEmpresas.findIndex(t => t.NomeEmpresa == this.empresaSelecionada);
    
    this.jogadorEdit.IdEmpresa = this.listaEmpresas[index].IdEmpresa;

    this.jogadorService.jogadorGravar(this.jogadorEdit)
        .subscribe(dados => {
            let retorno = ((dados as any[])?.[0])?.[0];

            this.cdr.markForCheck();

            this.listaJogadores.push({
                IdJogador: retorno.IdJogador,
                Ativo: this.jogadorEdit.Ativo,
                DataCadastro: new Date(),
                email: this.jogadorEdit.email,
                IdEmpresa: this.jogadorEdit.IdEmpresa,
                NomeApelido: this.jogadorEdit.NomeApelido,
                Senha: this.jogadorEdit.Senha
            });
        });
  }

  listarJogadores() {
    let index = this.listaEmpresas.findIndex(t => t.NomeEmpresa == this.empresaSelecionada);

    this.jogadorService.jogadorListaEmpresa(this.listaEmpresas[index].IdEmpresa)
        .subscribe((dados: JogadorModel[]) => {
          this.listaJogadores = dados;
          this.cdr.markForCheck();
        });

    this.jogadorService.campeonatosDaEmpresa(this.listaEmpresas[index].IdEmpresa)
        .subscribe((dados: CampeonatoModel[]) => {
            let lista = dados;
            this.cdr.markForCheck();

            lista.unshift({
              IdCampeonato: 0,
              Nome: "",
              Ano: 0,
              Ativo: true
            });

            this.listaCampeonatos = lista;
            this.campeonatoSelecionado = "";
        });
  }

  ranking() {

  }

  rankingCampeonato() {
      let indexC = this.listaCampeonatos.findIndex(t => (t.Nome + " - " + t.Ano) == this.campeonatoSelecionado);
      let indexE = this.listaEmpresas.findIndex(t => t.NomeEmpresa == this.empresaSelecionada);

      this.matDialog.open(JogadorRanking, {
        width: "508px",
        height: "450px",
        disableClose: true,
        data: {
          campeonato: this.listaCampeonatos[indexC],
          empresa: this.listaEmpresas[indexE]
        }
      });
  }
}