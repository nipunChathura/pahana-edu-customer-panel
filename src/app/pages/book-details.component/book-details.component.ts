import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDto } from '../../services/dto/BookDto';
import { CartService } from '../../services/CartService';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent {
  @Input() book!: BookDto;
  @Output() close = new EventEmitter<void>();

  orderQuantity: number = 1;

  constructor(private cartService: CartService) {}

  // Get promotion price
  get promotionPrice(): number {
    if (!this.book) return 0;
    return this.book.promotionEnable
      ? (this.book.promotionBookPrice ?? 0)
      : (this.book.price ?? 0);
  }

  // Get saving amount
  get savingPrice(): number {
    if (!this.book) return 0;
    const price = this.book.price ?? 0;
    return price - this.promotionPrice;
  }

  // Get total price (quantity * unit price)
  get totalPrice(): number {
    if (!this.book) return 0;
    return (this.orderQuantity ?? 1) * this.promotionPrice;
  }

  // Increase order qty
  increaseQuantity(): void {
    this.orderQuantity++;
  }

  // Decrease order qty
  decreaseQuantity(): void {
    if (this.orderQuantity > 1) this.orderQuantity--;
  }

  // Add book to cart
  addToCart(): void {
    if (!this.book) return;
    this.cartService.addToCart(this.book, this.orderQuantity);
    console.log(`Added ${this.orderQuantity} of ${this.book.name ?? 'unknown'} to cart`);
    this.closePopup();
    alert(`${this.book.name} added to cart!`);
  }

  // Close popup
  closePopup(): void {
    this.close.emit();
  }
}
