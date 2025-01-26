import { Component, OnInit } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [
    { id: 1, name: 'Soil Enhancer', price: 750, imageUrl: 'assets/images/natural-fertilizer.jpg', category: 'Fertilizer' },
    { id: 2, name: 'Pesticide Control Spray', price: 1200, imageUrl: 'assets/images/organic-pesticide.jpg', category: 'Pesticide' },
    { id: 3, name: 'Epsom Salt', price: 100, imageUrl: 'assets/images/Epsom-Salt.webp', category: 'Medicine' },
    { id: 4, name: 'TB Drugs for Crops', price: 1500, imageUrl: 'assets/images/Drugs-for-Crops.webp', category: 'Medicine' },
    { id: 5, name: 'Plant Growth Booster', price: 950, imageUrl: 'assets/images/Plant-Growth-Booster.jpg', category: 'Medicine' },
    { id: 6, name: 'Crop Disease Control Kit', price: 2200, imageUrl: 'assets/images/Crop-Disease-Control-Kit.jfif', category: 'Medicine' },
    { id: 7, name: 'Antibiotics', price: 500, imageUrl: 'assets/images/antibiotics .webp', category: 'Medicine' },
    { id: 8, name: 'Magnesium Sulfate', price: 300, imageUrl: 'assets/images/Magnesium-Sulfate.jfif', category: 'Medicine' },
  ];

  filteredProducts: Product[] = [];
  searchTerm: string = '';
  selectedSort: string = '';
  cart: Product[] = []; // Array to store cart items

  ngOnInit() {
    this.filteredProducts = [...this.products];
  }

  applyFilter() {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.applySort(); // Ensure sorting is maintained
  }

  applySort() {
    if (this.selectedSort === 'name') {
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.selectedSort === 'priceAsc') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === 'priceDesc') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  addToCart(product: Product) {
    const existingProduct = this.cart.find((p) => p.id === product.id);
    if (!existingProduct) {
      this.cart.push(product);
      alert(`${product.name} has been added to the cart.`);
    } else {
      alert(`${product.name} is already in the cart.`);
    }
  }
}
