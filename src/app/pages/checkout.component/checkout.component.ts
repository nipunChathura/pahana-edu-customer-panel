import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/CartService';
import {BookDto} from '../../services/dto/BookDto';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog.component/confirm-dialog.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatIcon,
    MatIconButton,
    MatDivider,
    MatButton,
    NgIf,
    NgForOf
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems: { book: BookDto; quantity: number }[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Load current cart items
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  removeItem(index: number) {
    const bookId = this.cartItems[index].book.bookId!;
    this.cartService.removeFromCart(bookId);
    this.loadCart();
  }

  placeOrder() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirm Order', message: 'Are you sure you want to place this order?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Confirmed
        alert('Order placed successfully!');
        this.cartService.clearCart();
        this.loadCart();
      }
    });
  }

}
