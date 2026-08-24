import { TestBed } from '@angular/core/testing';

import { CartService } from './cart-service';
import { Product } from '../products/product';

const laptop: Product = {
  id: 1,
  name: 'Laptop',
  description: 'A fast laptop',
  price: 1000,
};

const speaker: Product = {
  id: 2,
  name: 'Bluetooth Speaker',
  description: 'A loud speaker',
  price: 200,
  originalPrice: 250,
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start empty', () => {
    expect(service.totalItems()).toBe(0);
  });

  it('should count each distinct product added', () => {
    service.addToCart(laptop);
    service.addToCart(speaker);

    expect(service.totalItems()).toBe(2);
  });

  it('should increment the quantity when the same product is added again', () => {
    service.addToCart(laptop);
    service.addToCart(laptop);
    service.addToCart(laptop);

    expect(service.totalItems()).toBe(3);
  });

  it('should expose one entry per distinct product', () => {
    service.addToCart(laptop);
    service.addToCart(laptop);
    service.addToCart(speaker);

    expect(service.items()).toEqual([
      { product: laptop, quantity: 2 },
      { product: speaker, quantity: 1 },
    ]);
  });

  it('should start with a zeroed total price', () => {
    expect(service.totalPrice()).toBe(0);
  });

  it('should multiply each price by its quantity', () => {
    service.addToCart(laptop);
    service.addToCart(laptop);
    service.addToCart(speaker);

    expect(service.totalPrice()).toBe(2200);
  });

  it('should recompute the total price when a product is removed', () => {
    service.addToCart(laptop);
    service.addToCart(speaker);
    service.removeFromCart(speaker.id);

    expect(service.totalPrice()).toBe(1000);
  });

  it('should report an empty cart before anything is added', () => {
    expect(service.isEmpty()).toBe(true);
  });

  it('should stop reporting an empty cart once a product is added', () => {
    service.addToCart(laptop);

    expect(service.isEmpty()).toBe(false);
  });

  it('should set a quantity outright instead of incrementing it', () => {
    service.addToCart(laptop);
    service.updateQuantity(laptop.id, 5);

    expect(service.items()).toEqual([{ product: laptop, quantity: 5 }]);
    expect(service.totalItems()).toBe(5);
    expect(service.totalPrice()).toBe(5000);
  });

  it('should lower a quantity as readily as it raises one', () => {
    service.addToCart(laptop);
    service.addToCart(laptop);
    service.addToCart(laptop);
    service.updateQuantity(laptop.id, 1);

    expect(service.items()).toEqual([{ product: laptop, quantity: 1 }]);
  });

  it('should leave other products untouched', () => {
    service.addToCart(laptop);
    service.addToCart(speaker);
    service.updateQuantity(laptop.id, 4);

    expect(service.items()).toEqual([
      { product: laptop, quantity: 4 },
      { product: speaker, quantity: 1 },
    ]);
  });

  it('should drop the product when its quantity is set to zero', () => {
    service.addToCart(laptop);
    service.addToCart(speaker);
    service.updateQuantity(laptop.id, 0);

    expect(service.items()).toEqual([{ product: speaker, quantity: 1 }]);
    expect(service.isEmpty()).toBe(false);
  });

  it('should drop the product when its quantity is set to a negative number', () => {
    service.addToCart(laptop);
    service.updateQuantity(laptop.id, -3);

    expect(service.items()).toEqual([]);
    expect(service.isEmpty()).toBe(true);
  });

  it('should ignore updates for a product that is not in the cart', () => {
    service.addToCart(laptop);
    service.updateQuantity(speaker.id, 9);

    expect(service.items()).toEqual([{ product: laptop, quantity: 1 }]);
  });

  it('should drop every product when the cart is cleared', () => {
    service.addToCart(laptop);
    service.addToCart(laptop);
    service.addToCart(speaker);

    service.clearCart();

    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should leave an already empty cart untouched when cleared', () => {
    service.clearCart();

    expect(service.items()).toEqual([]);
    expect(service.isEmpty()).toBe(true);
  });

  it('should accept new products after being cleared', () => {
    service.addToCart(laptop);
    service.clearCart();
    service.addToCart(speaker);

    expect(service.items()).toEqual([{ product: speaker, quantity: 1 }]);
    expect(service.totalPrice()).toBe(200);
  });

  it('should report an empty cart again after the last product is removed', () => {
    service.addToCart(laptop);
    service.addToCart(laptop);
    service.removeFromCart(laptop.id);

    expect(service.isEmpty()).toBe(false);

    service.removeFromCart(laptop.id);

    expect(service.isEmpty()).toBe(true);
    expect(service.items()).toEqual([]);
  });
});
