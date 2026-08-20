import { Component } from '@angular/core';
import { Header } from './header/header';
import { ProductsGrid } from './products/products-grid/products-grid';

@Component({
  selector: 'app-root',
  imports: [Header, ProductsGrid],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
