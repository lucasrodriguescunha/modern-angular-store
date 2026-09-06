import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductsGrid, SEARCH_DEBOUNCE_MS } from './products-grid';

import { Product } from '../product';
import { CartService } from '../../services/cart/cart-service';

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

describe('ProductsGrid', () => {
  let component: ProductsGrid;
  let fixture: ComponentFixture<ProductsGrid>;
  let cartService: CartService;
  let httpTesting: HttpTestingController;

  const cards = () => fixture.nativeElement.querySelectorAll('app-product-card');
  const cardNames = () =>
    Array.from(cards() as NodeListOf<HTMLElement>).map((card) =>
      card.querySelector('mat-card-title')?.textContent?.trim(),
    );
  const hint = () => fixture.nativeElement.querySelector('mat-hint')?.textContent?.trim();
  const searchInput = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;
  const clearButton = () =>
    fixture.nativeElement.querySelector('button[aria-label="Clear search"]') as HTMLButtonElement;

  const statusState = () => fixture.nativeElement.querySelector('.status-state') as HTMLElement;
  const retryButton = () =>
    fixture.nativeElement.querySelector('.status-state button') as HTMLButtonElement;

  const skeletons = () => fixture.nativeElement.querySelectorAll('app-product-card-skeleton');
  const skeletonGrid = () => (skeletons()[0] as HTMLElement | undefined)?.parentElement;
  const liveRegion = () => fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;

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

  const type = async (term: string) => {
    const input = searchInput();
    input.value = term;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const settleDebounce = async () => {
    await new Promise((resolve) => setTimeout(resolve, SEARCH_DEBOUNCE_MS + 50));
    await fixture.whenStable();
  };

  const search = async (term: string) => {
    await type(term);
    await settleDebounce();
  };

  // Renderiza o component e devolve a requisição que o resource acabou de disparar,
  // ainda pendente, para que cada cenário decida como respondê-la. A detecção de
  // mudanças aqui é síncrona de propósito: enquanto o resource carrega ele mantém um
  // `PendingTask` aberto, e `whenStable()` só resolveria depois da resposta.
  const render = () => {
    fixture = TestBed.createComponent(ProductsGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();

    return httpTesting.expectOne('/products.json');
  };

  const renderLoaded = async () => {
    render().flush(catalog);
    await fixture.whenStable();
  };

  const renderFailed = async () => {
    render().flush('', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
  };

  afterEach(() => {
    TestBed.inject(MatSnackBar).dismiss();
    httpTesting.verify();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsGrid],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } },
      ],
    }).compileComponents();

    cartService = TestBed.inject(CartService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  describe('while the catalog is loading', () => {
    it('should show skeleton cards instead of the grid', () => {
      const request = render();

      expect(skeletons().length).toBe(3);
      expect(cards().length).toBe(0);

      request.flush(catalog);
    });

    it('should lay the skeletons out with the product grid', () => {
      const request = render();

      expect(skeletonGrid()?.classList.contains('products-grid')).toBe(true);

      request.flush(catalog);
    });

    it('should announce the loading state to screen readers', () => {
      const request = render();

      expect(liveRegion().textContent?.trim()).toBe('Loading products');

      request.flush(catalog);
    });

    it('should keep the skeletons out of the accessibility tree', () => {
      const request = render();

      expect(skeletonGrid()?.getAttribute('aria-hidden')).toBe('true');
      expect(skeletonGrid()?.querySelector('button')).toBeNull();

      request.flush(catalog);
    });

    it('should hide the result count until the catalog arrives', () => {
      const request = render();

      expect(hint()).toBeUndefined();

      request.flush(catalog);
    });

    it('should disable the search field', async () => {
      const request = render();

      // O `NgModel` propaga o estado `disabled` para o elemento em um microtask,
      // então ele ainda não está aplicado ao fim da detecção de mudanças síncrona.
      await Promise.resolve();

      expect(searchInput().disabled).toBe(true);

      request.flush(catalog);
    });
  });

  describe('when the catalog fails to load', () => {
    beforeEach(renderFailed);

    it('should explain the failure instead of rendering the grid', () => {
      expect(statusState().textContent).toContain("We couldn't load the products.");
      expect(cards().length).toBe(0);
      expect(skeletons().length).toBe(0);
    });

    it('should stop announcing the loading state', () => {
      expect(liveRegion().textContent?.trim()).toBe('');
    });

    it('should offer a retry button', () => {
      expect(retryButton().textContent?.trim()).toBe('Try again');
    });

    it('should show the skeletons again while retrying', () => {
      retryButton().click();
      fixture.detectChanges();

      expect(skeletons().length).toBe(3);
      expect(statusState()).toBeNull();

      httpTesting.expectOne('/products.json').flush(catalog);
    });

    it('should render the catalog after a successful retry', async () => {
      retryButton().click();
      fixture.detectChanges();

      httpTesting.expectOne('/products.json').flush(catalog);
      await fixture.whenStable();

      expect(cards().length).toBe(3);
      expect(statusState()).toBeNull();
    });
  });

  describe('with the catalog loaded', () => {
    beforeEach(renderLoaded);

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render every product when there is no search term', () => {
      expect(cards().length).toBe(3);
      expect(hint()).toBe('3 of 3 products');
    });

    it('should drop the skeletons once the catalog arrives', () => {
      expect(skeletons().length).toBe(0);
    });

    it('should stop announcing the loading state', () => {
      expect(liveRegion().textContent?.trim()).toBe('');
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

    it('should hold the previous results until the typing pauses', async () => {
      await type('speaker');

      expect(cards().length).toBe(3);
      expect(hint()).toBe('3 of 3 products');

      await settleDebounce();

      expect(cardNames()).toEqual(['Portable Bluetooth Speaker']);
    });

    it('should settle on the last term of a burst of keystrokes', async () => {
      await type('s');
      await type('sp');
      await type('spe');

      expect(cards().length).toBe(3);

      await settleDebounce();

      expect(cardNames()).toEqual(['Portable Bluetooth Speaker']);
    });

    it('should show the clear button as soon as a key is pressed', async () => {
      await type('speaker');

      expect(clearButton()).not.toBeNull();
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
});
