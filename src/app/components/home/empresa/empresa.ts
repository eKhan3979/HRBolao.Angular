import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule, RouterOutlet } from "@angular/router";

import { EmpresaModel } from '../../../models/empresaModel';
import { EmpresaService } from '../../../services/empresa-service';

@Component({
  selector: 'app-empresa',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css',
})
export class Empresa implements OnInit {
  itens = [
    { name: 'Campeonato', path: '/Home/Campeonato' },
    { name: 'Empresa', path: '/Home/Empresa' },
    { name: 'Jogador', path: '/Home/Jogador' },
    { name: 'Time', path: '/Home/Time' },
  ]
  
  listaEmpresas: EmpresaModel[] = undefined as unknown as EmpresaModel[];

  formulario: any;

  constructor(private empresaService: EmpresaService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder) {
    this.formulario = this.fb.group({
        IdEmpresa: [0],
        NomeEmpresa: ['', Validators.required],
        Ativo: [true, Validators.required]
    });
  }

  ngOnInit() {
    this.empresaService.listaEmpresas().subscribe(dados => {
      this.listaEmpresas = dados;
      this.cdr.markForCheck(); 
    });
  }

  gravar() {

  }
}