import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  itens = [
    { name: 'Campeonato', path: '/Home/Campeonato' },
    { name: 'Empresa', path: '/Home/Empresa' },
    { name: 'Jogador', path: '/Home/Jogador' },
    { name: 'Time', path: '/Home/Time' },
  ]
} 