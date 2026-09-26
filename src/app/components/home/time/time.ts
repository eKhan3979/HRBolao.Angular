import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCell, MatHeaderCell, MatColumnDef, MatHeaderCellDef, MatCellDef, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule, RouterOutlet } from "@angular/router";

import { TimeModel } from '../../../models/timeModel';
import { TimeNumeroModel } from '../../../models/timeNumeroModel';
import { TimeService } from '../../../services/time-service';

@Component({
  selector: 'app-time',
  imports: [
    CommonModule,
    FormsModule,
    MatCell,
    MatColumnDef,    
    MatHeaderCell,
    MatTableModule,
    ReactiveFormsModule,
    RouterModule,
    MatHeaderCellDef,
    MatCellDef
],
  templateUrl: './time.html',
  styleUrl: './time.css',
})
export class Time implements OnInit {
  itens = [
    { name: 'Campeonato', path: '/Home/Campeonato' },
    { name: 'Empresa', path: '/Home/Empresa' },
    { name: 'Jogador', path: '/Home/Jogador' },
    { name: 'Time', path: '/Home/Time' },
  ]

  erroMsg: string = "";

  timeEdit: TimeModel = undefined as unknown as TimeModel;

  listaTimes: TimeModel[] = undefined as unknown as TimeModel[];
  
  listaTipos: string[] = [
    "",
    "Brasileiro",
    "Seleção",
    "Sul-Americano",
    "Europeu",
    "Asiático",
    "Norte-Americano",
    "Africano",
    "Centro-Americano",
    "Oceania"
  ];
  listaUF: string[] = [ "AM", "BA", "CE", "GO", "MG", "PA", "PR", "SC", "SP", "RJ", "RS"];

  displayedColumns = [
      'Numero',
      'Nome',
      'Abreviatura',
      'TipoStr',
      'Cidade',
      'UF',      
      'Ativo'
    ];

  dataSource = new MatTableDataSource<TimeModel>([
  ]);  

  constructor(private dialog: MatDialog,
              private timeService: TimeService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.timeEdit = {
      IdTime: 0,
      Nome: "",
      Abreviatura: "",
      Cidade: "",
      UF: "",
      Ativo: true,
      AtivoStr: "Sim",
      Tipo: 0,
      TipoStr: "",
      Numero: 0
    }
  }

  ngOnInit(): void {
    this.timeService.listaTimes()
        .subscribe(dados => {
            this.listaTimes = dados;
            this.cdr.markForCheck();

            let numero = 1;

            this.listaTimes.forEach(item => {
              item.AtivoStr = (item.Ativo ? "Sim" : "Não");
              item.Numero = numero;
              item.TipoStr = this.listaTipos[item.Tipo]
              numero++;
            });

            this.dataSource = new MatTableDataSource<TimeModel>(this.listaTimes);  
        });
  }

  editar(time: TimeModel) {
    console.log(time);
  }

  gravar() {
    if (this.podeGravar()) {


      this.timeService
          .gravar(this.timeEdit)
          .subscribe(dados => {
              let idTime = dados[0].IdTime;
              this.cdr.markForCheck();

              let timeNovo: TimeModel = {
                  IdTime: idTime, 
                  Nome: this.timeEdit.Nome,
                  Abreviatura: this.timeEdit.Abreviatura,
                  Cidade: this.timeEdit.Cidade,
                  UF: this.timeEdit.UF,
                  Ativo: this.timeEdit.Ativo,
                  AtivoStr: this.timeEdit.Ativo ? "Sim" : "Não",
                  Tipo: this.timeEdit.Tipo,
                  TipoStr: this.timeEdit.TipoStr,
                  Numero: this.listaTimes.length + 1
              };

              this.listaTimes.push(timeNovo);

              this.listaTimes.sort((a, b) => a.Nome.localeCompare(b.Nome));

              let index = this.listaTipos.findIndex(t => t == this.timeEdit.TipoStr);
              let lista = this.listaTimes.filter(t => t.Tipo == index);

              for (let index = 0; index < lista.length; index++) {
                lista[index].Numero = index + 1;
              };

              this.dataSource = new MatTableDataSource<TimeModel>(lista);  

              this.timeEdit = {
                Abreviatura: "",
                Ativo: true,
                AtivoStr: "Sim",
                Cidade: "",
                IdTime: 0,
                Nome: "",
                Numero: 0,
                Tipo: this.timeEdit.Tipo,
                TipoStr: this.timeEdit.TipoStr,
                UF: ""
              };
          });
    } else {
      this.snackBar.open('Erro: ' + this.erroMsg, 'Fechar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'});
    }
  }

  podeGravar(): boolean {
    let ok: boolean = true;
    
    if (this.timeEdit.Nome.length == 0) {
      ok = false;
      this.erroMsg = "- Preencha o Nome do time";
    } else {
      if (this.timeEdit.Abreviatura.length == 0) {
        ok = false;
        this.erroMsg = "- Preencha a Abreviatura do time";
      } else {
        if (this.timeEdit.TipoStr.length == 0) {
          ok = false;
          this.erroMsg = "- Selecione o Tipo de time";
        }
      }
    }

    return ok;
  }

  selecionarTipo(){
    let index = this.listaTipos.findIndex(t => t == this.timeEdit.TipoStr);

    if (index > 0) {
      this.timeEdit.Tipo = index;
      
      let lista = this.listaTimes.filter(t => t.Tipo == index);

      for (let index = 0; index < lista.length; index++) {
        lista[index].Numero = index + 1;
      };

      this.dataSource = new MatTableDataSource<TimeModel>(lista);  
    } else {
      this.dataSource = new MatTableDataSource<TimeModel>(this.listaTimes);
    }
  }
}