import { computed, effect, Injectable, signal } from '@angular/core';
import { Product } from '../../products/product';
import { CartItem } from '../../cart/cart-item';

export const CART_STORAGE_KEY = 'modern-angular-store.cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartItems = signal<CartItem[]>(readStoredCart());

  readonly items = this.cartItems.asReadonly();

  readonly totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0),
  );

  readonly totalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  readonly isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {
    effect(() => writeStoredCart(this.cartItems()));
  }

  addToCart(product: Product) {
    this.cartItems.update((items) => {
      const existingItem = items.find((item) => item.product.id === product.id);

      if (existingItem) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: number) {
    this.cartItems.update((items) =>
      items.flatMap((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : [];
      }),
    );
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartItems.update((items) =>
      items.flatMap((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        return quantity > 0 ? { ...item, quantity } : [];
      }),
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}

function readStoredCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;

    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage may be unavailable or full; the cart still works for this session.
  }
}

function isCartItem(value: unknown): value is CartItem {
  const item = value as CartItem | null;

  return (
    typeof item?.quantity === 'number' &&
    item.quantity > 0 &&
    typeof item.product?.id === 'number' &&
    typeof item.product.name === 'string' &&
    typeof item.product.price === 'number'
  );
}
