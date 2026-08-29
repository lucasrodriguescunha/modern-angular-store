import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductsGrid } from './products-grid';

import { CartService } from '../../services/cart/cart-service';

describe('ProductsGrid', () => {
  let component: ProductsGrid;
  let fixture: ComponentFixture<ProductsGrid>;
  let cartService: CartService;

  const cards = () => fixture.nativeElement.querySelectorAll('app-product-card');
  const cardNames = () =>
    Array.from(cards() as NodeListOf<HTMLElement>).map((card) =>
      card.querySelector('mat-card-title')?.textContent?.trim(),
    );
  const hint = () => fixture.nativeElement.querySelector('mat-hint').textContent.trim();
  const searchInput = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;
  const clearButton = () =>
    fixture.nativeElement.querySelector('button[aria-label="Clear search"]') as HTMLButtonElement;

  const cardEl = (index: number) => cards()[index] as HTMLElement;

  const snackBars = () => document.querySelectorAll('.mdc-snackbar__label');
  const snackBarMessage = () => snackBars()[0]?.textContent?.trim();
  const snackBarAction = () =>
    document.querySelector('.mat-mdc-snack-bar-action') as HTMLButtonElement | null;

  const addButton = (index: number) =>
    cardEl(index).querySelector('.add-button') as HTMLButtonElement;

  const click = async (button: HTMLButtonElement) => {
    button.click();
    await fixture.whenStable();
  };

  const search = async (term: string) => {
    const input = searchInput();
    input.value = term;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  afterEach(() => {
    TestBed.inject(MatSnackBar).dismiss();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsGrid],
      providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsGrid);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render every product when there is no search term', () => {
    expect(cards().length).toBe(3);
    expect(hint()).toBe('3 of 3 products');
  });

  it('should filter by product name', async () => {
    await search('fitness watch');

    expect(cardNames()).toEqual(['Smart Fitness Watch']);
  });

  it('should filter by product description', async () => {
    await search('noise cancellation');

    expect(cardNames()).toEqual(['Premium Wireless Headphones']);
  });

  it('should ignore casing and surrounding whitespace in the search term', async () => {
    await search('   SPEAKER   ');

    expect(cardNames()).toEqual(['Portable Bluetooth Speaker']);
  });

  it('should report how many products matched the search', async () => {
    await search('speaker');

    expect(hint()).toBe('1 of 3 products');
  });

  it('should show the empty state when nothing matches', async () => {
    await search('no such product');

    expect(cards().length).toBe(0);
    expect(hint()).toBe('0 of 3 products');
    expect(fixture.nativeElement.querySelector('.empty-state').textContent).toContain(
      'No products match your search',
    );
  });

  it('should hide the clear button while the search field is empty', () => {
    expect(clearButton()).toBeNull();
  });

  it('should clear the search when the clear button is clicked', async () => {
    await search('speaker');
    expect(clearButton()).not.toBeNull();

    clearButton().click();
    await fixture.whenStable();

    expect(searchInput().value).toBe('');
    expect(clearButton()).toBeNull();
    expect(cards().length).toBe(3);
  });

  it('should add the product to the cart when a card asks for it', async () => {
    await click(addButton(0));

    expect(cartService.totalItems()).toBe(1);
  });

  it('should keep the add button after the product goes into the cart', async () => {
    await click(addButton(0));

    expect(addButton(0)).not.toBeNull();
  });

  it('should raise the quantity when the same card is added again', async () => {
    await click(addButton(0));
    await click(addButton(0));

    expect(cartService.items()).toEqual([{ product: component['products']()[0], quantity: 2 }]);
  });

  it('should show no snack bar until a product is added', () => {
    expect(snackBarMessage()).toBeUndefined();
  });

  it('should confirm the addition with a snack bar naming the product', async () => {
    await click(addButton(1));

    expect(snackBarMessage()).toBe('Smart Fitness Watch added to cart');
  });

  it('should let the snack bar be dismissed', async () => {
    await click(addButton(0));

    snackBarAction()!.click();
    await fixture.whenStable();

    expect(snackBarMessage()).toBeUndefined();
  });

  it('should replace the message when another product is added', async () => {
    await click(addButton(0));
    await click(addButton(2));

    expect(snackBars().length).toBe(1);
    expect(snackBarMessage()).toBe('Portable Bluetooth Speaker added to cart');
  });
});
