import { TestBed } from '@angular/core/testing';

import { ProductService } from './product-service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose the catalog', () => {
    expect(service.products().map((product) => product.name)).toEqual([
      'Premium Wireless Headphones',
      'Smart Fitness Watch',
      'Portable Bluetooth Speaker',
    ]);
  });

  it('should give every product a unique id', () => {
    const ids = service.products().map((product) => product.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should only mark a product as discounted when the original price is higher', () => {
    const discounted = service.products().filter((product) => product.originalPrice !== undefined);

    expect(discounted.length).toBe(2);
    discounted.forEach((product) => expect(product.originalPrice!).toBeGreaterThan(product.price));
  });

  it('should share the same instance across injections', () => {
    expect(TestBed.inject(ProductService)).toBe(service);
  });
});
