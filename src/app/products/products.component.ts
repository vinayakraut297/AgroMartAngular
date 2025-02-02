import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environment';
import { Product, ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  user: any = null;
  organicMedicines: Product[] = [];
  cart: Product[] = [];

  constructor(private http: HttpClient, private productService: ProductService,private router: Router) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.user = user ? JSON.parse(user) : null;
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.organicMedicines = products;
    });
  }

  addToCart(product: Product): void {
    if (this.user) {

      // this.http.post<{ message: string }>('http://localhost:8080/api/cart/add', {
      this.http.post<{ message: string }>(`${this.apiUrl}/api/cart/add`, {
        userId: this.user.id,
        productId: product.id,
        quantity: 1
      }).subscribe({
        next: (response) => {
          if (response && response.message) {
            this.cart.push(product);
            alert(`${product.name} added to cart`);
          }
        },
        error: (err) => {
          console.error('Failed to add item to cart:', err);
          alert('Error adding item to cart');
        }
      });
    } else {
      alert('Please log in to add items to your cart');
    }
  }
  logout(): void {
    localStorage.removeItem('user'); // Remove user data from local storage
    // this.user = null;               // Clear the user object in the component
    alert('You have been logged out.');
    this.router.navigate(['/welcome']);

  }

  checkout(): void {
    if (this.cart.length > 0) {
      const cartForBill = [...this.cart];

      // this.http.post('http://localhost:8080/api/cart/checkout', {
      this.http.post(`${this.apiUrl}/api/cart/checkout`, {
        userId: this.user.id,
        items: this.cart
      }).subscribe({
        next: (response: any) => {
          alert('Bill created successfully!');
          this.cart = [];

          const billWindow = window.open('', '_blank', 'width=800,height=600');
          if (billWindow) {
            billWindow.document.write(`
            <html>
              <head>
                <title>Bill Details</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                  th { background-color: #f4f4f4; }
                </style>
              </head>
              <body>
                <h1>Bill Details</h1>
                <p>Thank you for your purchase, <strong>${this.user.name}</strong>!</p>
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cartForBill.map(item => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.description}</td>
                        <td>${item.price.toFixed(2)}</td>
                      </tr>`).join('')}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="text-align:right;"><strong>Total:</strong></td>
                      <td><strong>${cartForBill.reduce((total, item) => total + item.price, 0).toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </body>
            </html>
          `);
            billWindow.document.close();
          }
        },
        error: (err) => {
          console.error('Failed to create bill:', err);
          alert('Error creating bill');
        }
      });
    } else {
      alert('Your cart is empty. Add some items before checking out.');
    }
  }
}