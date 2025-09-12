import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mobile-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  template: `
    <h1 mat-dialog-title>Enter Mobile Number</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Mobile Number</mat-label>
        <input matInput [(ngModel)]="mobile"
               type="tel"
               pattern="[0-9]*"
               maxlength="10"
               (keypress)="allowNumbersOnly($event)" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="close()">Cancel</button>
      <button mat-button color="primary" (click)="submit()">Submit</button>
    </div>
  `,
  styles: [`
    .dialog-content {
      display: flex;
      flex-direction: column;
      justify-content: center; /* vertical center */
      align-items: center;     /* horizontal center */
      min-height: 100px;       /* adjust height as needed */
    }

    mat-form-field {
      width: 80%; /* adjust width of input */
    }

    .dialog-actions {
      display: flex;
      justify-content: center; /* center the buttons horizontally */
      gap: 16px; /* space between buttons */
    }
  `]
})
export class MobileDialogComponent {
  mobile: string = '';

  constructor(private dialogRef: MatDialogRef<MobileDialogComponent>) {}

  submit() {
    if (!this.mobile) {
      alert('Mobile number is required!');
      return;
    }
    this.dialogRef.close(this.mobile);
  }

  close() {
    this.dialogRef.close(null);
  }

  allowNumbersOnly(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
