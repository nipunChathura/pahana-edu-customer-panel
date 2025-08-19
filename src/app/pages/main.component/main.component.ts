import {Component, ViewChild, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatBadge} from '@angular/material/badge';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {MatTooltip} from '@angular/material/tooltip';
import {CartService} from '../../services/CartService';
import {BookDto} from '../../services/dto/BookDto';
import {MatRipple} from '@angular/material/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet, MatFormField, MatIcon, MatIconButton, MatInput, MatLabel, MatSuffix,
    MatBadge, MatMenu, NgIf, MatDivider, CurrencyPipe, MatButton, NgForOf,
    MatMenuTrigger, MatTooltip, MatRipple, FormsModule
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild(MatMenuTrigger) cartMenuTrigger!: MatMenuTrigger;

  favoriteCount = 5;
  cartItems: { book: BookDto; quantity: number }[] = [];
  cartCount = 0;

  searchTerm: string = '';

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    // Subscribe to cart changes to auto-update cartItems and cartCount
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
      this.cartItems = this.cartService.getCartItems();
    });
  }

  searchBook(type: string): void {
    if (!this.searchTerm.trim()) return;

    // Here, we navigate to the same page structure as your category/promotion
    this.router.navigate(['/book', type, this.searchTerm])
      .then(success => {
        if (!success) console.error('Navigation failed');
      })
      .catch(err => console.error('Navigation error:', err));
  }

  getTotal(): number {
    return this.cartService.getTotalPrice();
  }

  removeItem(index: number, event?: MouseEvent) {
    event?.stopPropagation();
    const bookId = this.cartItems[index].book.bookId!;
    this.cartService.removeFromCart(bookId);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  // Optional: call this from book popup
  addToCart(book: BookDto, quantity: number = 1) {
    this.cartService.addToCart(book, quantity);
    // cartCount and cartItems update automatically due to subscription
  }
}
