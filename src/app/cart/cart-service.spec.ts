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
});
