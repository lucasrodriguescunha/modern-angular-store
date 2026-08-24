import { Product } from './../product';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly addButtonLabel = input('Add to Cart');

  readonly quantity = input(0);

  readonly addToCart = output<Product>();
  readonly removeFromCart = output<Product>();
  readonly quantityChange = output<number>();

  protected onAddToCart() {
    this.addToCart.emit(this.product());
  }

  protected onRemoveFromCart() {
    this.removeFromCart.emit(this.product());
  }

  protected onQuantityInput(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.quantityChange.emit(Number.isFinite(value) ? value : 0);
  }
}
