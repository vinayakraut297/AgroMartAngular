import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  user: any = null;
  organicMedicines: Product[] = [
    { id: 1, name: 'Organic Pesticide', description: 'Effective natural pesticide for a variety of crops.', price: 12.99, imageUrl: 'assets/images/organic-pesticide.jpg' },
    { id: 2, name: 'Natural Fertilizer', description: 'Enrich your soil with this organic fertilizer.', price: 8.50, imageUrl: 'assets/images/natural-fertilizer.jpg' },
    { id: 3, name: 'Herbal Insecticide', description: 'Protect crops from insects with this herbal solution.', price: 15.75, imageUrl: 'assets/images/herbal-insecticide.jpg' }
  ];

  cart: Product[] = []; // To store items added to the cart

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.user = user ? JSON.parse(user) : null;
  }

  addToCart(product: Product): void {
    if (this.user) {
      console.log('User ID:', this.user.id);
      console.log('Product ID:', product.id);

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

  // View the cart
  viewCart(): void {
    if (this.user) {
      this.http.get<Product[]>(`${this.apiUrl}/api/cart/${this.user.id}`).subscribe({
        next: (cartItems) => {
          this.cart = cartItems;
          alert('Cart updated');
        },
        error: (err) => {
          console.error('Failed to fetch cart:', err);
          alert('Error fetching cart');
        }
      });
    } else {
      alert('Please log in to view your cart');
    }
  }

// checkout(): void {
//   if (this.cart.length > 0) {
//     // Create a copy of the current cart for the bill before clearing it
//     const cartForBill = [...this.cart];
    
//     this.http.post('http://localhost:8080/api/cart/checkout', {
//       userId: this.user.id,
//       items: this.cart
//     }).subscribe({
//       next: (response: any) => {
//         alert('Bill created successfully!');
//         this.cart = []; // Clear the cart only after processing

//         // Open the bill in a new window
//         const billWindow = window.open('', '_blank', 'width=800,height=600');
//         if (billWindow) {
//           billWindow.document.write(`
//             <html>
//               <head>
//                 <title>Bill Details</title>
//                 <style>
//                   body { font-family: Arial, sans-serif; margin: 20px; }
//                   table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//                   th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//                   th { background-color: #f4f4f4; }
//                 </style>
//               </head>
//               <body>
//                 <h1>Bill Details</h1>
//                 <p>Thank you for your purchase!</p>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Product Name</th>
//                       <th>Description</th>
//                       <th>Price</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     ${cartForBill.map(item => `
//                       <tr>
//                         <td>${item.name}</td>
//                         <td>${item.description}</td>
//                         <td>${item.price.toFixed(2)}</td>
//                       </tr>`).join('')}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <td colspan="2" style="text-align:right;"><strong>Total:</strong></td>
//                       <td><strong>${cartForBill.reduce((total, item) => total + item.price, 0).toFixed(2)}</strong></td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </body>
//             </html>
//           `);
//           billWindow.document.close();
//         }
//       },
//       error: (err) => {
//         console.error('Failed to create bill:', err);
//         alert('Error creating bill');
//       }
//     });
//   } else {
//     alert('Your cart is empty. Add some items before checking out.');
//   }
// }

checkout(): void {
  if (this.cart.length > 0) {
    // Create a copy of the current cart for the bill before clearing it
    const cartForBill = [...this.cart];

    this.http.post(`${this.apiUrl}/api/cart/checkout`, {
      userId: this.user.id,
      items: this.cart
    }).subscribe({
      next: (response: any) => {
        alert('Bill created successfully!');
        this.cart = []; // Clear the cart only after processing

        // Open the bill in a new window
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