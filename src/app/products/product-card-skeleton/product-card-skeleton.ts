import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-card-skeleton',
  imports: [MatCardModule],
  templateUrl: './product-card-skeleton.html',
  styleUrl: './product-card-skeleton.scss',
})
export class ProductCardSkeleton {}
