import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { BookDetailsComponent } from '../book-details.component/book-details.component';
import { DataService } from '../../services/DataService';
import { BookDto } from '../../services/dto/BookDto';
import { CustomerOpenApiRequest } from '../../services/request/CustomerOpenApiRequest';
import {CartService} from '../../services/CartService';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [NgForOf, NgIf, BookDetailsComponent],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  id!: string | null;
  type!: string | null;
  selectedBook?: BookDto;

  // Initialize books as empty array to avoid undefined issues
  @Input() books: BookDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cardService: CartService) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');
    this.getBooks();
    console.log("list page");
    console.log(this.cardService.getTotalCount())
  }

  openBookDetails(book: BookDto) {
    this.selectedBook = book;
  }

  getBooks(): void {
    const request: CustomerOpenApiRequest = {
      customerId: null,
      bookId: null,
      requestType: this.type,
      requestId: this.id
    };

    this.dataService.getBooks(request).subscribe({
      next: (response) => {
        console.log(response);
        this.books = response?.bookDetailsList ?? []; // fallback to empty array
      },
      error: (err) => {
        this.books = [];
        console.error('Error fetching books:', err);
      }
    });
  }

  onPopupClose() {
    this.selectedBook = undefined;
    console.log("Popup closed");
    console.log(this.cardService.getTotalCount())
  }
}

