import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horizontal-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horizontal-scroll.component.html',
  styleUrls: ['./horizontal-scroll.component.css']
})
export class HorizontalScrollComponent implements AfterViewInit, OnChanges {
  @Input() step = 260;
  @Input() showArrows = true;
  @Input() smooth = true;

  @ViewChild('viewport') viewportRef!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  get viewport() { return this.viewportRef.nativeElement; }

  next() {
    if (this.viewport) {
      this.viewport.scrollBy({ left: this.step, behavior: this.smooth ? 'smooth' : 'auto' });
    }
  }

  prev() {
    if (this.viewport) {
      this.viewport.scrollBy({ left: -this.step, behavior: this.smooth ? 'smooth' : 'auto' });
    }
  }
}
