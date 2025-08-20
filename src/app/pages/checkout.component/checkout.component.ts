// import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { CartService } from '../../services/CartService';
// import { BookDto } from '../../services/dto/BookDto';
// import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmDialogComponent } from '../confirm-dialog.component/confirm-dialog.component';
// import { CommonModule } from '@angular/common';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';
// import {DataService} from '../../services/DataService';
//
//
// @Component({
//   selector: 'app-checkout',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatIconModule,
//     MatDividerModule,
//     ReactiveFormsModule, //
//       ],
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css'],
// })
// export class CheckoutComponent implements OnInit {
//   cartItems: { book: BookDto; quantity: number }[] = [];
//   totalPrice: number = 0;
//
//   customerForm!: FormGroup;
//   paymentForm!: FormGroup;
//
//   discountAmount: number = 0;
//   paidAmount: number = 0;
//
//
//   private isBrowser: boolean;
//
//   constructor(
//     private cartService: CartService,
//     private fb: FormBuilder,
//     private dataService: DataService,
//     private dialog: MatDialog,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }
//
//   ngOnInit(): void {
//     this.loadCart();
//
//     // Customer Form
//     this.customerForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(2)]],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', [Validators.required, Validators.pattern(/^(?:\+94|0)?7\d{8}$/)]],
//     });
//
//     // Payment Form
//     this.paymentForm = this.fb.group({
//       cardHolder: ['', [Validators.required, Validators.minLength(2)]],
//       cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
//       expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
//       cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
//     });
//
//     // Load stored values if running in browser
//     if (this.isBrowser) {
//       const storedName = localStorage.getItem('name');
//       const storedEmail = localStorage.getItem('email');
//       if (storedName || storedEmail) {
//         this.customerForm.patchValue({
//           name: storedName || '',
//           email: storedEmail || '',
//         });
//       }
//     }
//   }
//
//   loadCart() {
//     this.cartItems = this.cartService.getCartItems();
//     console.log(this.cartItems)
//     this.totalPrice = this.cartService.getTotalPrice();
//   }
//
//   removeItem(index: number) {
//     const bookId = this.cartItems[index].book.bookId!;
//     this.cartService.removeFromCart(bookId);
//     this.loadCart();
//   }
//
//   placeOrder() {
//     if (this.customerForm.invalid || this.paymentForm.invalid) {
//       this.customerForm.markAllAsTouched();
//       this.paymentForm.markAllAsTouched();
//       return;
//     }
//
//     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//       width: '350px',
//       data: { title: 'Confirm Order', message: 'Are you sure you want to place this order?' },
//     });
//
//     dialogRef.afterClosed().subscribe((result) => {
//       if (result) {
//         const customer = this.customerForm.value;
//         const payment = this.paymentForm.value;
//
//         console.log('Customer Info:', customer);
//         console.log('Payment Info:', payment);
//         console.log('Order Items:', this.cartItems);
//
//         if (this.isBrowser) {
//           localStorage.setItem('name', customer.name);
//           localStorage.setItem('email', customer.email);
//         }
//
//         alert('Order placed successfully!');
//         this.cartService.clearCart();
//         this.loadCart();
//         this.customerForm.reset();
//         this.paymentForm.reset();
//       }
//     });
//   }
//
//
//   // Enable Place Order button
//   get canPlaceOrder(): boolean {
//     return this.customerForm.valid && this.paymentForm.valid && this.cartItems.length > 0;
//   }
// }


import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { CartService } from '../../services/CartService';
import { DataService } from '../../services/DataService';
import { ConfirmDialogComponent } from '../confirm-dialog.component/confirm-dialog.component';
import { BookDto } from '../../services/dto/BookDto';
import { CustomerDto } from '../../services/dto/CustomerDto';
import { OrderDto } from '../../services/dto/OrderDto';
import { OrderDetailsDto } from '../../services/dto/OrderDetailsDto';
import {PlaceOrderRequest} from '../../services/request/PlaceOrderRequest';
import {Router} from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {

  cartItems: { book: BookDto; quantity: number }[] = [];
  totalPrice = 0;
  discountAmount = 0;
  paidAmount = 0;

  customerForm!: FormGroup;
  paymentForm!: FormGroup;

  private isBrowser: boolean;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private dataService: DataService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadCart();
    this.initForms();
    this.loadStoredCustomer();
  }

  private initForms() {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(?:\+94|0)?7\d{8}$/)]],
    });

    this.paymentForm = this.fb.group({
      cardHolder: ['', [Validators.required, Validators.minLength(2)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
    });
  }

  private loadStoredCustomer() {
    if (this.isBrowser) {
      const storedName = localStorage.getItem('name');
      const storedEmail = localStorage.getItem('email');
      if (storedName || storedEmail) {
        this.customerForm.patchValue({
          name: storedName || '',
          email: storedEmail || '',
        });
      }
    }
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
    this.discountAmount = this.cartItems.reduce((sum, item) => {
      const discount = item.book.isPromotionEnable
        ? ((item.book.price ?? 0) - (item.book.promotionPrice ?? item.book.price ?? 0)) * item.quantity
        : 0;
      return sum + discount;
    }, 0);
    this.paidAmount = this.totalPrice - this.discountAmount;
  }

  removeItem(index: number) {
    const bookId = this.cartItems[index].book.bookId!;
    this.cartService.removeFromCart(bookId);
    this.loadCart();
  }

  private buildOrderDto(): OrderDto {
    const orderDetails: OrderDetailsDto[] = this.cartItems.map(item => ({
      orderDetailId: null,
      orderId: null,
      bookId: item.book.bookId!,
      book: item.book,
      itemPrice: item.book.price ?? 0,
      itemQuantity: item.quantity,
      discountPrice: item.book.isPromotionEnable
        ? item.book.promotionPrice ?? item.book.price ?? 0
        : item.book.price ?? 0,
      promotionId: item.book.isPromotionEnable ? item.book.promotionId : null,
      promotion: null,
    }));


    return {
      orderId: null,
      customerId: null,
      customer: null,
      orderDate: null,
      totalAmount: this.totalPrice,
      discountAmount: this.discountAmount,
      paidAmount: this.paidAmount,
      paymentType: 'CARD',
      orderDetailDtos: orderDetails,
    };
  }

  placeOrder() {
    if (this.customerForm.invalid || this.paymentForm.invalid || this.cartItems.length === 0) {
      this.customerForm.markAllAsTouched();
      this.paymentForm.markAllAsTouched();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirm Order', message: 'Are you sure you want to place this order?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const customerValue = this.customerForm.value;

      const customerDto: CustomerDto = {
        customerId: null,
        customerRegNo: null,
        customerName: customerValue.name,
        email: customerValue.email,
        phoneNumber: customerValue.phone,
        membershipType: null,
        status: null,
        picture: '',
      };

      const payload: PlaceOrderRequest = {
        customerDto: customerDto,
        orderDto: this.buildOrderDto(),
      };

      console.log(payload);

      this.dataService.placeOrder(payload).subscribe({
        next: response => {

          if (response.status === 'success') {
            alert('Order placed successfully!');
            this.cartService.clearCart();
            this.loadCart();
            this.customerForm.reset();
            this.paymentForm.reset();

            if (this.isBrowser) {
              localStorage.setItem('name', payload.customerDto.customerName);
              localStorage.setItem('email', payload.customerDto.email);
            }
            this.cartService.clearCart();
            this.ngOnInit();
            this.router.navigate(['/home']);
          } else {
            console.error('Error placing order:', response.responseMessage);
            alert('Failed to place order. Please try again.');
          }
        },
        error: (err) => {
          console.error('Error placing order:', err);
          alert('Failed to place order. Please try again.');
        },
      });
    });
  }

  get canPlaceOrder(): boolean {
    return this.customerForm.valid && this.paymentForm.valid && this.cartItems.length > 0;
  }
}
