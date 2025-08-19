import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { HorizontalScrollComponent } from '../horizontal-scroll.component/horizontal-scroll.component';
import { DataService } from '../../services/DataService';
import { StorageService } from '../../services/StorageService';
import { CategoryDto } from '../../services/dto/CategoryDto';
import {PromotionDto} from '../../services/dto/PromotionDto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    HorizontalScrollComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  imageList: any[] = [];
  categories: CategoryDto[] = [];
  promotions: PromotionDto[] = [];
  customerId: string | null = null;
  screenWidth: number = 0;

  constructor(
    private router: Router,
    private dataService: DataService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.customerId = this.storageService.getItem('customerId');

    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
      window.addEventListener('resize', () => {
        this.screenWidth = window.innerWidth;
      });
    }

    this.loadImages();
    this.loadCategories();
    this.loadPromotions();
  }

  loadImages() {
    this.imageList = [
      { id: 1, image: '/assets/scroll/scroll_4.jpg' },
      { id: 2, image: '/assets/scroll/scroll_1.jpg' },
      { id: 3, image: '/assets/scroll/scroll_2.jpg' },
      { id: 4, image: '/assets/scroll/scroll_3.jpg' },
      { id: 5, image: '/assets/scroll/scroll_5.jpg' },
      { id: 6, image: '/assets/scroll/scroll_6.jpg' },
      { id: 7, image: '/assets/scroll/scroll_7.jpg' }
    ];
  }

  loadCategories() {
    this.dataService.getCategoriesByStatus().subscribe({
      next: response => {
        if (response.status === 'success') {
          this.categories = response.categoryDetailsList;
        } else {
          console.error('Error loading categories', response.responseMessage);
        }
      },
      error: err => console.error('Error loading categories', err)
    });
  }

  loadPromotions() {
    this.dataService.getPromotions().subscribe({
      next: response => {
        if (response.status === 'success') {
          this.promotions = response.promotionDtoList;
        } else {
          console.error('Error loading categories', response.responseMessage);
        }
      },
      error: err => console.error('Error loading categories', err)
    });
  }

  goToBookList(item: any) {
    if (!item?.promotionName && !item?.categoryName) return;
    const name = item.promotionName ?? item.categoryName;
    this.router.navigate(['/book', name]);
  }

  navigateBookList(item:any, type:string): void {
    if (!item?.categoryId && !item?.promotionId) return;
    const name = item.categoryId ?? item.promotionId;
    this.router.navigate(['/book',type, name]).then(r => {
      console.error('navigation error');
    });
  }

}
