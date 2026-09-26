import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule, RouterOutlet } from "@angular/router";

import { CampeonatoModel } from '../../../models/campeonatoModel';
import { CampeonatoService } from '../../../services/campeonato-service';
import { EmpresaModel } from '../../../models/empresaModel';
import { JogadorModel } from '../../../models/jogadorModel';

import { Ranking } from '../campeonato/ranking/ranking';

@Component({
  selector: 'app-campeonato',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
],
  templateUrl: './campeonato.html',
  styleUrl: './campeonato.css',
})
export class Campeonato implements OnInit {

  itens = [
    { name: 'Campeonato', path: '/Home/Campeonato' },
    { name: 'Empresa', path: '/Home/Empresa' },
    { name: 'Jogador', path: '/Home/Jogador' },
    { name: 'Time', path: '/Home/Time' },
  ]

  listaCampeonatos: CampeonatoModel[] = [];

  empresa: EmpresaModel = undefined as unknown as EmpresaModel;
  jogador: JogadorModel = undefined as unknown as JogadorModel;

  formulario: any;

  constructor(private dialog: MatDialog,
              private campeonatoService: CampeonatoService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private router: Router) {
    this.empresa = history.state.empresa;
    this.jogador = history.state.jogador;

    this.formulario = this.fb.group({
      IdCampeonato: [0],
      Nome: ['', Validators.required],
      Ano: [2026, Validators.required],
      Ativo: [true, Validators.required]
    });
  }
  
  ngOnInit() {
    this.campeonatoService.listaCampeonatos().subscribe(dados => {
      this.listaCampeonatos = dados;
      this.cdr.markForCheck(); 
    });
  }

  gravar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;    
    }

    this.campeonatoService.gravar(this.formulario.value as any)
                          .subscribe(dados => {

      if (dados.length > 0) {
        let novo: CampeonatoModel = {
          IdCampeonato: dados[0].IdCampeonato,
          Nome: this.formulario.value.Nome,
          Ano: this.formulario.value.Ano,
          Ativo: this.formulario.value.Ativo
        };

        this.listaCampeonatos.push(novo);
        this.listaCampeonatos.sort((a, b) => a.Nome.localeCompare(b.Nome));
        this.formulario.reset();
        this.cdr.markForCheck(); 
      }});
  }

  abrirTimes(campeonato: CampeonatoModel) {
    this.router.navigate(['/Home/Campeonato/Times'], { state: { campeonato: campeonato } });
  }

  jogosCampeonato(campeonato: CampeonatoModel) {
    this.router.navigate(['/Home/Campeonato/Jogos'], { state: { campeonato: campeonato } });
  }

  ranking(campeonato: CampeonatoModel) {
    this.dialog.open(Ranking, {
      width: "363px",
      height: "420px",
      maxWidth: "363px",
      disableClose: true,
      data: {
        campeonato: campeonato,
        empresa: this.empresa
      }
    })
  }
}