import {
  ChangeDetectionStrategy,
  Component,
  computed,
  debounced,
  inject,
  signal,
} from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { ProductCardSkeleton } from '../product-card-skeleton/product-card-skeleton';
import { Product } from '../product';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart/cart-service';
import { ProductService } from '../../services/product/product-service';

export const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-products-grid',
  imports: [
    ProductCard,
    ProductCardSkeleton,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './products-grid.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './products-grid.scss',
})
export class ProductsGrid {
  protected readonly skeletons = Array.from({ length: 3 }, (_, index) => index);

  protected readonly searchTerm = signal('');

  private readonly debouncedSearchTerm = debounced(this.searchTerm, (term) =>
    term.trim()
      ? new Promise<void>((resolve) => setTimeout(resolve, SEARCH_DEBOUNCE_MS))
      : undefined,
  );

  private readonly cartService = inject(CartService);

  private readonly productService = inject(ProductService);

  private readonly snackBar = inject(MatSnackBar);

  protected readonly products = this.productService.products;

  protected readonly isLoading = this.productService.isLoading;

  protected readonly error = this.productService.error;

  protected readonly filteredProducts = computed(() => {
    const term = this.debouncedSearchTerm.value().toLocaleLowerCase().trim();
    if (!term) return this.products();

    return this.products().filter(
      (product) =>
        product.name.toLocaleLowerCase().includes(term) ||
        product.description.toLocaleLowerCase().includes(term),
    );
  });

  protected onAddToCart(product: Product) {
    this.cartService.addToCart(product);

    this.snackBar.open(`${product.name} added to cart`, 'Dismiss', { duration: 3000 });
  }

  protected clearSearchInput() {
    this.searchTerm.set('');
  }

  protected reloadProducts() {
    this.productService.reload();
  }
}
