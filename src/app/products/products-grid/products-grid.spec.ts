import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsGrid } from './products-grid';

describe('ProductsGrid', () => {
  let component: ProductsGrid;
  let fixture: ComponentFixture<ProductsGrid>;

  const cards = () => fixture.nativeElement.querySelectorAll('app-product-card');
  const cardNames = () =>
    Array.from(cards() as NodeListOf<HTMLElement>).map((card) =>
      card.querySelector('mat-card-title')?.textContent?.trim(),
    );
  const hint = () => fixture.nativeElement.querySelector('mat-hint').textContent.trim();
  const searchInput = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;
  const clearButton = () =>
    fixture.nativeElement.querySelector('button[aria-label="Clear search"]') as HTMLButtonElement;

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
});
