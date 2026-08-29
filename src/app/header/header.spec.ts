import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { Header } from './header';

import { CartService } from '../cart/cart-service';
import { Product } from '../products/product';

const laptop: Product = {
  id: 1,
  name: 'Laptop',
  description: 'A fast laptop',
  price: 1000,
};

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let cartService: CartService;

  const badge = () => fixture.nativeElement.querySelector('.mat-badge');
  const cartButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('button[aria-label^="Shopping cart"]');

  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the badge when the cart is empty', () => {
    expect(badge().classList).toContain('mat-badge-hidden');
  });

  it('should show the number of items in the cart', async () => {
    cartService.addToCart(laptop);
    cartService.addToCart(laptop);
    await fixture.whenStable();

    expect(badge().classList).not.toContain('mat-badge-hidden');
    expect(fixture.nativeElement.querySelector('.mat-badge-content').textContent).toBe('2');
  });

  it('should open the cart dialog from the cart button', async () => {
    expect(document.querySelector('app-cart-dialog')).toBeNull();

    cartButton().click();
    await fixture.whenStable();

    expect(document.querySelector('app-cart-dialog')).not.toBeNull();
  });
});
