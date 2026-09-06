import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { Product } from '../../products/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsResource = httpResource<Product[]>(() => '/products.json', {
    defaultValue: [],
  });

  // `value()` lança quando o resource está em erro — nem o `defaultValue` cobre esse
  // caso. O guard mantém o signal seguro de ler em qualquer ponto do template.
  readonly products = computed(() =>
    this.productsResource.hasValue() ? this.productsResource.value() : [],
  );

  readonly isLoading = this.productsResource.isLoading;

  readonly error = this.productsResource.error;

  reload() {
    this.productsResource.reload();
  }
}
