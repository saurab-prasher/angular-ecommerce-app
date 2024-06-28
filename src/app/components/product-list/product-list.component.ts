import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.grid.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    // use the activated route - State of route at this given moment in time - Map of all the route parameters: boolean
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //  get the "id" param string. convert string to a number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id that previous
    // then set the thePageNumber back to 1
    if (this.previousCategoryId === this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe((data) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      });
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // now search for products using keyword
    this.productService
      .searchProducts(theKeyword)
      .subscribe((data) => (this.products = data));
  }
}
