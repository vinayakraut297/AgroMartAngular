import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/product.service';
import { Router } from '@angular/router';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  products: Product[] = [];
  newProduct: Product = { name: '', description: '', price: 0,quantity:'', imageUrl: '' };
  isEditMode: boolean = false;
  editingProductId: number | null = null;

  constructor(private productService: ProductService,private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe(product => {
      this.products.push(product);
      this.newProduct = { name: '', description: '', price: 0,quantity:'', imageUrl: '' };
    });
  }

  editProduct(product: Product): void {
    this.isEditMode = true;
    this.editingProductId = product.id!;
    this.newProduct = { ...product };
  }

  updateProduct(): void {
    if (this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, this.newProduct).subscribe(updatedProduct => {
        const index = this.products.findIndex(p => p.id === this.editingProductId);
        this.products[index] = updatedProduct;
        this.isEditMode = false;
        this.newProduct = { name: '', description: '', price: 0 ,quantity:'', imageUrl: '' };
        this.editingProductId = null;
      });
    }
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter(product => product.id !== id);
    });
  }
  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/welcome']);

  }
}
