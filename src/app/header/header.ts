import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../services/cart/cart-service';
import { CartDialog } from '../cart/cart-dialog/cart-dialog';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.scss',
})
export class Header {
  protected readonly cartService = inject(CartService);

  private readonly dialog = inject(MatDialog);

  protected readonly cartLabel = computed(() => {
    const count = this.cartService.totalItems();
    return `Shopping cart, ${count} ${count === 1 ? 'item' : 'items'}`;
  });

  protected openCart() {
    this.dialog.open(CartDialog, {
      width: '480px',
      maxWidth: '95vw',
      autoFocus: 'dialog',
    });
  }
}
