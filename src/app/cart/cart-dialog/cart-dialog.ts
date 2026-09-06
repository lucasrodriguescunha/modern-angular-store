import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-cart-dialog',
  imports: [
    MatDialogModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
  ],
  templateUrl: './cart-dialog.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './cart-dialog.scss',
})
export class CartDialog {
  protected readonly cartService = inject(CartService);
}
