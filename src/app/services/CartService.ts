// import { Injectable } from '@angular/core';
// import { BookDto } from './dto/BookDto';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private storageKey = 'cart_items';
//   private items: { book: BookDto; quantity: number }[] = [];
//
//   constructor() {
//     this.loadCart();
//   }
//
//   private isBrowser(): boolean {
//     return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
//   }
//
//   private saveCart(): void {
//     if (this.isBrowser()) {
//       localStorage.setItem(this.storageKey, JSON.stringify(this.items));
//     }
//   }
//
//   private loadCart(): void {
//     if (this.isBrowser()) {
//       const data = localStorage.getItem(this.storageKey);
//       this.items = data ? JSON.parse(data) : [];
//     } else {
//       this.items = []; // fallback for SSR / non-browser env
//     }
//   }
//
//   addToCart(book: BookDto, quantity: number = 1): void {
//     const existingItem = this.items.find(i => i.book.bookId === book.bookId);
//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       this.items.push({ book, quantity });
//     }
//     this.saveCart();
//   }
//
//   getCartItems(): { book: BookDto; quantity: number }[] {
//     return this.items;
//   }
//
//   setCartItems(items: { book: BookDto; quantity: number }[]): void {
//     this.items = items;
//     this.saveCart();
//   }
//
//   removeFromCart(bookId: number): void {
//     this.items = this.items.filter(i => i.book.bookId !== bookId);
//     this.saveCart();
//   }
//
//   clearCart(): void {
//     this.items = [];
//     this.saveCart();
//   }
//
//   getTotalCount(): number {
//     return this.items.reduce((sum, item) => sum + item.quantity, 0);
//   }
//
//   getTotalPrice(): number {
//     return this.items.reduce((sum, item) => {
//       const price = item.book.isPromotionEnable
//         ? (item.book.promotionPrice ?? item.book.price ?? 0)
//         : (item.book.price ?? 0);
//       return sum + (price * item.quantity);
//     }, 0);
//   }
// }
//


import { Injectable } from '@angular/core';
import { BookDto } from './dto/BookDto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'cart_items';
  private items: { book: BookDto; quantity: number }[] = [];

  // Observable to track cart changes
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private saveCart(): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    }
    this.cartCountSubject.next(this.getTotalCount()); // notify subscribers
  }

  private loadCart(): void {
    if (this.isBrowser()) {
      const data = localStorage.getItem(this.storageKey);
      this.items = data ? JSON.parse(data) : [];
    } else {
      this.items = [];
    }
    this.cartCountSubject.next(this.getTotalCount());
  }

  addToCart(book: BookDto, quantity: number = 1): void {
    const existingItem = this.items.find(i => i.book.bookId === book.bookId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ book, quantity });
    }
    this.saveCart();
  }

  removeFromCart(bookId: number): void {
    this.items = this.items.filter(i => i.book.bookId !== bookId);
    this.saveCart();
  }

  clearCart(): void {
    this.items = [];
    this.saveCart();
  }

  getCartItems(): { book: BookDto; quantity: number }[] {
    return this.items;
  }

  getTotalCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => {
      const price = item.book.isPromotionEnable
        ? (item.book.promotionPrice ?? item.book.price ?? 0)
        : (item.book.price ?? 0);
      return sum + price * item.quantity;
    }, 0);
  }
}
