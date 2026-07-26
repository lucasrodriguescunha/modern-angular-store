import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCard } from './product-card';
import { Product } from '../product';

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
    expect(text).toContain('1000');
  });

  it('should not show the sale badge without an original price', () => {
    expect(fixture.nativeElement.querySelector('.sale-badge')).toBeNull();
  });

  it('should show the sale badge and original price when discounted', async () => {
    fixture.componentRef.setInput('product', { ...laptop, originalPrice: 1500 });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.sale-badge')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.original-price').textContent).toContain('1500');
  });

  it('should emit the product when the add button is clicked', () => {
    let emitted: Product | undefined;
    component.addToCart.subscribe((product) => (emitted = product));

    fixture.nativeElement.querySelector('mat-card-actions button').click();

    expect(emitted).toEqual(laptop);
  });
});
