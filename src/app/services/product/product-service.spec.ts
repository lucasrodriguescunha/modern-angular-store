import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ProductService } from './product-service';

import { Product } from '../../products/product';

const catalog: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    description:
      'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 199.99,
    originalPrice: 249.99,
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description:
      'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
    price: 299.99,
  },
  {
    id: 3,
    name: 'Portable Bluetooth Speaker',
    description: 'Compact speaker with powerful bass and 12-hour battery life.',
    price: 79.99,
    originalPrice: 99.99,
  },
];

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  // O resource dispara a requisição a partir de um effect, então nada é enviado
  // até que o tick rode.
  const pendingRequest = () => {
    TestBed.tick();

    return httpTesting.expectOne('/products.json');
  };

  const settle = async (respond: (request: TestRequest) => void) => {
    respond(pendingRequest());
    await TestBed.inject(ApplicationRef).whenStable();
  };

  const load = (body: Product[] = catalog) => settle((request) => request.flush(body));

  const fail = () =>
    settle((request) => request.flush('', { status: 500, statusText: 'Server Error' }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();

    await load();
  });

  it('should request the catalog only once', async () => {
    await load();

    TestBed.tick();
    httpTesting.expectNone('/products.json');
  });

  it('should start loading with an empty catalog and no error', () => {
    const request = pendingRequest();

    expect(service.isLoading()).toBe(true);
    expect(service.products()).toEqual([]);
    expect(service.error()).toBeUndefined();

    request.flush(catalog);
  });

  it('should expose the catalog once it is loaded', async () => {
    await load();

    expect(service.products().map((product) => product.name)).toEqual([
      'Premium Wireless Headphones',
      'Smart Fitness Watch',
      'Portable Bluetooth Speaker',
    ]);
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeUndefined();
  });

  it('should give every product a unique id', async () => {
    await load();

    const ids = service.products().map((product) => product.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should only mark a product as discounted when the original price is higher', async () => {
    await load();

    const discounted = service.products().filter((product) => product.originalPrice !== undefined);

    expect(discounted.length).toBe(2);
    discounted.forEach((product) => expect(product.originalPrice!).toBeGreaterThan(product.price));
  });

  it('should surface the error and keep the catalog readable when the request fails', async () => {
    await fail();

    expect(service.error()).toBeTruthy();
    expect(service.products()).toEqual([]);
    expect(service.isLoading()).toBe(false);
  });

  it('should recover the catalog when a failed request is reloaded', async () => {
    await fail();

    service.reload();
    await load();

    expect(service.products().map((product) => product.name)).toEqual([
      'Premium Wireless Headphones',
      'Smart Fitness Watch',
      'Portable Bluetooth Speaker',
    ]);
    expect(service.error()).toBeUndefined();
  });

  it('should share the same instance across injections', async () => {
    expect(TestBed.inject(ProductService)).toBe(service);

    await load();
  });
});
