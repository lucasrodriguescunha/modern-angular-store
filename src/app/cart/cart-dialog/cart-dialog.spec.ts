import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { CartDialog } from './cart-dialog';
import { CartService } from '../cart-service';
import { Product } from '../../products/product';

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

describe('CartDialog', () => {
  let component: CartDialog;
  let fixture: ComponentFixture<CartDialog>;
  let cartService: CartService;

  const rows = () => fixture.nativeElement.querySelectorAll('mat-list-item');
  const emptyState = () => fixture.nativeElement.querySelector('.empty-state');
  const total = () => fixture.nativeElement.querySelector('.total-row strong');
  const button = (label: string): HTMLButtonElement =>
    fixture.nativeElement.querySelector(`button[aria-label="${label}"]`);
  const clearButton = () =>
    [...fixture.nativeElement.querySelectorAll('mat-dialog-actions button')].find(
      (element) => (element as HTMLElement).textContent?.trim() === 'Clear Cart',
    ) as HTMLButtonElement | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDialog],
      providers: [{ provide: MatDialogRef, useValue: { close: () => {} } }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartDialog);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an empty state instead of a list when the cart is empty', () => {
    expect(emptyState()).not.toBeNull();
    expect(rows().length).toBe(0);
  });

  it('should render one row per distinct product', async () => {
    cartService.addToCart(laptop);
    cartService.addToCart(laptop);
    cartService.addToCart(speaker);
    await fixture.whenStable();

    expect(emptyState()).toBeNull();
    expect(rows().length).toBe(2);
  });

  it('should show the cart total', async () => {
    cartService.addToCart(laptop);
    cartService.addToCart(speaker);
    await fixture.whenStable();

    expect(total().textContent).toContain('1,200.00');
  });

  it('should raise the quantity from the increase button', async () => {
    cartService.addToCart(laptop);
    await fixture.whenStable();

    button('Increase quantity of Laptop').click();

    expect(cartService.totalItems()).toBe(2);
  });

  it('should lower the quantity from the decrease button', async () => {
    cartService.addToCart(laptop);
    cartService.addToCart(laptop);
    await fixture.whenStable();

    button('Decrease quantity of Laptop').click();

    expect(cartService.totalItems()).toBe(1);
  });

  it('should drop the whole row from the remove button', async () => {
    cartService.addToCart(laptop);
    cartService.addToCart(laptop);
    cartService.addToCart(speaker);
    await fixture.whenStable();

    button('Remove Laptop from the cart').click();
    await fixture.whenStable();

    expect(cartService.items()).toEqual([{ product: speaker, quantity: 1 }]);
    expect(rows().length).toBe(1);
  });

  it('should empty the cart from the clear button', async () => {
    cartService.addToCart(laptop);
    await fixture.whenStable();

    clearButton()!.click();
    await fixture.whenStable();

    expect(cartService.isEmpty()).toBe(true);
    expect(emptyState()).not.toBeNull();
  });

  it('should hide the clear button while the cart is empty', () => {
    expect(clearButton()).toBeUndefined();
  });
});
