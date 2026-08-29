import { TestBed } from '@angular/core/testing';

import { CART_STORAGE_KEY, CartService } from './cart-service';
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

describe('CartService persistence', () => {
  const store = (value: unknown) => localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value));

  const stored = () => JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? 'null');

  const createService = () => TestBed.inject(CartService);

  const flush = () => TestBed.tick();

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should start empty when nothing was stored', () => {
    expect(createService().items()).toEqual([]);
  });

  it('should restore the cart left by a previous session', () => {
    store([
      { product: laptop, quantity: 2 },
      { product: speaker, quantity: 1 },
    ]);

    const service = createService();

    expect(service.items()).toEqual([
      { product: laptop, quantity: 2 },
      { product: speaker, quantity: 1 },
    ]);
    expect(service.totalItems()).toBe(3);
    expect(service.totalPrice()).toBe(2200);
  });

  it('should persist the cart when a product is added', () => {
    const service = createService();

    service.addToCart(laptop);
    service.addToCart(laptop);
    flush();

    expect(stored()).toEqual([{ product: laptop, quantity: 2 }]);
  });

  it('should persist the cart when a product is removed', () => {
    const service = createService();

    service.addToCart(laptop);
    service.addToCart(speaker);
    service.removeFromCart(laptop.id);
    flush();

    expect(stored()).toEqual([{ product: speaker, quantity: 1 }]);
  });

  it('should persist the cart when a quantity is updated', () => {
    const service = createService();

    service.addToCart(laptop);
    service.updateQuantity(laptop.id, 4);
    flush();

    expect(stored()).toEqual([{ product: laptop, quantity: 4 }]);
  });

  it('should persist an empty cart once it is cleared', () => {
    const service = createService();

    service.addToCart(laptop);
    service.clearCart();
    flush();

    expect(stored()).toEqual([]);
  });

  it('should ignore a corrupted stored cart', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'not json');

    expect(createService().items()).toEqual([]);
  });

  it('should ignore stored content that is not a list', () => {
    store({ product: laptop, quantity: 1 });

    expect(createService().items()).toEqual([]);
  });

  it('should drop stored entries that are not cart items', () => {
    store([
      { product: laptop, quantity: 2 },
      { product: speaker },
      { quantity: 3 },
      { product: { id: 3, name: 'Mystery', price: 'free' }, quantity: 1 },
      { product: speaker, quantity: 0 },
      null,
    ]);

    expect(createService().items()).toEqual([{ product: laptop, quantity: 2 }]);
  });

  it('should keep working when the write is rejected', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const service = createService();

    service.addToCart(laptop);

    expect(flush).not.toThrow();
    expect(service.items()).toEqual([{ product: laptop, quantity: 1 }]);

    setItem.mockRestore();
  });
});
