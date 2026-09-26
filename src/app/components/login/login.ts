import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { EmpresaModel } from '../../models/empresaModel';
import { EmpresaService } from '../../services/empresa-service';
import { Empresa } from '../home/empresa/empresa';
import { JogadorModel } from '../../models/jogadorModel';
import { JogadorService } from '../../services/jogador-service';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  listaEmpresas: EmpresaModel[] = undefined as unknown as EmpresaModel[];

  empresaSelecionada: EmpresaModel = undefined as unknown as EmpresaModel;

  jogadorLogin: JogadorModel = {
    IdJogador: 0,
    IdEmpresa: 0,
    NomeApelido: "",
    Senha: "",
    Ativo: true,
    DataCadastro: new Date(),
    email: ""
  };

  constructor(private empresaService: EmpresaService,
              private jogadorService: JogadorService,
              private loginService: LoginService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              @Inject(MatSnackBar) private snackbar: MatSnackBar,
              private router: Router
            ) {
  }

  ngOnInit() {
    this.jogadorLogin.NomeApelido = "";
    this.jogadorLogin.email = "";
    this.jogadorLogin.Senha = "";

    this.empresaService
        .listaEmpresas()
        .subscribe(dados => {
          this.listaEmpresas = dados;
          if (this.listaEmpresas.length == 1)
            this.empresaSelecionada = this.listaEmpresas[0];
          this.cdr.markForCheck();
        });
  }

  loginJogador() {
    this.loginService
        .login(this.jogadorLogin.email, this.jogadorLogin.Senha)
        .subscribe(dados => {
            let jogador = this.jogadorLogin;
            
            if (dados.length > 0)
              jogador = dados[0];
            
            this.cdr.markForCheck();

            if (jogador.IdJogador > 0)
            {
                this.jogadorLogin = jogador;

                this.router.navigate(['/Home/Campeonato'], {
                                        state: {
                                          empresa: this.empresaSelecionada,
                                          jogador: this.jogadorLogin
                                        }
                                    });
                } else {
                  this.snackbar.open('- Usuário/senha não encontrado !', 'Fechar', {
                      duration: 3000,
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom'
                    });
                }
                      
    });
  }
}