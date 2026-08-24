import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsGrid } from './products-grid';

import { CartService } from '../../cart/cart-service';

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

  const addButton = (index: number) =>
    cardEl(index).querySelector('.add-button') as HTMLButtonElement;
  const increaseButton = (index: number) =>
    cardEl(index).querySelector('button[aria-label^="Increase"]') as HTMLButtonElement;
  const decreaseButton = (index: number) =>
    cardEl(index).querySelector('button[aria-label^="Decrease"]') as HTMLButtonElement;

  const quantityInput = (index: number) =>
    cardEl(index).querySelector('.quantity-field input') as HTMLInputElement;

  const click = async (button: HTMLButtonElement) => {
    button.click();
    await fixture.whenStable();
  };

  const typeQuantity = async (index: number, value: string) => {
    const input = quantityInput(index);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const search = async (term: string) => {
    const input = searchInput();
    input.value = term;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsGrid],
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

  it('should offer the add button, and no stepper, while the product is out of the cart', () => {
    expect(addButton(0)).not.toBeNull();
    expect(quantityInput(0)).toBeNull();
    expect(increaseButton(0)).toBeNull();
  });

  it('should swap the add button for the stepper once the product is in the cart', async () => {
    await click(addButton(0));

    expect(addButton(0)).toBeNull();
    expect(quantityInput(0).value).toBe('1');
    expect(increaseButton(0)).not.toBeNull();
    expect(decreaseButton(0)).not.toBeNull();
  });

  it('should only swap the card that owns the product', async () => {
    await click(addButton(0));

    expect(addButton(1)).not.toBeNull();
    expect(quantityInput(1)).toBeNull();
  });

  it('should raise the quantity from the stepper', async () => {
    await click(addButton(0));
    await click(increaseButton(0));

    expect(quantityInput(0).value).toBe('2');
    expect(cartService.totalItems()).toBe(2);
  });

  it('should lower the quantity from the stepper', async () => {
    await click(addButton(0));
    await click(increaseButton(0));
    await click(decreaseButton(0));

    expect(quantityInput(0).value).toBe('1');
    expect(cartService.totalItems()).toBe(1);
  });

  it('should fall back to the add button when the stepper reaches zero', async () => {
    await click(addButton(0));
    await click(decreaseButton(0));

    expect(cartService.isEmpty()).toBe(true);
    expect(addButton(0)).not.toBeNull();
    expect(quantityInput(0)).toBeNull();
  });

  it('should push a typed quantity into the cart', async () => {
    await click(addButton(0));

    await typeQuantity(0, '7');

    expect(cartService.totalItems()).toBe(7);
    expect(cartService.items()).toEqual([{ product: component['products']()[0], quantity: 7 }]);
  });

  it('should drop the product from the cart when its quantity is typed down to zero', async () => {
    await click(addButton(0));

    await typeQuantity(0, '0');

    expect(cartService.isEmpty()).toBe(true);
    expect(addButton(0)).not.toBeNull();
  });
});
