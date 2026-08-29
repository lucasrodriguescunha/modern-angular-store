import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCard } from './product-card';
import { Product } from '../product';

registerLocaleData(localePt);

const laptop: Product = {
  id: 1,
  name: 'Laptop',
  description: 'A fast laptop',
  price: 1000,
};

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', laptop);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the product name and price', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Laptop');
    expect(text).toMatch(/R\$\s*1\.000,00/);
  });

  it('should not show the sale badge without an original price', () => {
    expect(fixture.nativeElement.querySelector('.sale-badge')).toBeNull();
  });

  it('should show the sale badge and original price when discounted', async () => {
    fixture.componentRef.setInput('product', { ...laptop, originalPrice: 1500 });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.sale-badge')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.original-price').textContent).toMatch(
      /R\$\s*1\.500,00/,
    );
  });

  it('should emit the product when the add button is clicked', () => {
    let emitted: Product | undefined;
    component.addToCart.subscribe((product) => (emitted = product));

    fixture.nativeElement.querySelector('.add-button').click();

    expect(emitted).toEqual(laptop);
  });
});
