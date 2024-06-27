import { Component } from '@angular/core';
import { Product } from '../common/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.grid.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products: Product[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.listProducts();
  }

  listProducts() {
    this.productService
      .getProductList()
      .subscribe((data) => (this.products = data));
  }
}
