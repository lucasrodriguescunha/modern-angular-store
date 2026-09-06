import { Product } from './../product';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, CurrencyPipe],
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly addButtonLabel = input('Add to Cart');

  readonly addToCart = output<Product>();

  protected onAddToCart() {
    this.addToCart.emit(this.product());
  }
}
