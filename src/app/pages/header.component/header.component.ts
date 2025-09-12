// import { Component, AfterViewInit } from '@angular/core';
// import { NgIf } from '@angular/common';
// import { RouterLink, Router } from '@angular/router';
// import { AuthService } from '../../services/AuthService';
// import { environment } from '../../../environments/environment';
// import {CustomerDto} from '../../services/dto/CustomerDto';
// import {MatToolbar} from '@angular/material/toolbar';
// import {MatButton, MatIconButton} from '@angular/material/button';
// import {MatIcon} from '@angular/material/icon';
// import {MatTooltip} from '@angular/material/tooltip';
//
// declare const google: any;
//
// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [NgIf, RouterLink],
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css']
// })
// export class HeaderComponent implements AfterViewInit {
//   user: CustomerDto | null = null;
//
//   constructor(private authService: AuthService, private router: Router) {}
//
//   ngAfterViewInit() {
//     if (typeof window !== 'undefined' && google?.accounts?.id) {
//       (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
//
//       google.accounts.id.initialize({
//         client_id: environment.googleClientId,
//         callback: (window as any).handleCredentialResponse
//       });
//
//       const btn = document.getElementById('googleBtn');
//       if (btn) {
//         google.accounts.id.renderButton(btn, { theme: 'outline', size: 'large' });
//       }
//     }
//   }
//
//   handleCredentialResponse(response: any) {
//     const credential = response.credential;
//     const mobile = prompt("Enter your mobile number:");
//     if (!mobile) {
//       alert("Mobile number is required!");
//       return;
//     }
//
//     this.authService.sendGoogleCredential(credential, mobile).subscribe({
//       next: (response) => {
//         console.log(response)
//         if (response.status === 'success') {
//           this.user = response.customerDto;
//           localStorage.setItem('email', response.customerDto.email);
//           localStorage.setItem('name', response.customerDto.customerName);
//           localStorage.setItem('profile', response.customerDto.picture);
//           this.router.navigate(['/home']).then(() => {
//             console.log('Navigation success!');
//           }).catch(err => {
//             console.error('Navigation error:', err);
//           });
//         } else {
//           // this.snackBar.open('Customer update Error ' + response.responseMessage, 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
//           console.error('Save error:', response.responseMessage);
//         }
//       },
//       error: (err) => {
//         // this.snackBar.open('Failed to update customer', 'Close', { duration: 3000, panelClass: ['snack-error'], horizontalPosition: 'center', verticalPosition: 'top' });
//         console.error('Save error:', err);
//       }
//     });
//   }
//
//   logout() {
//     this.user = null;
//   }
// }

import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { environment } from '../../../environments/environment';
import { CustomerDto } from '../../services/dto/CustomerDto';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {MobileDialogComponent} from './mobile-dialog.component';

declare const google: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink, MatIconButton, MatIcon],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnInit {
  user: CustomerDto | null = null;

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('email');
      if (email) {
        this.user = {
          email: email,
          customerName: localStorage.getItem('name') ?? '',
          picture: localStorage.getItem('profile') ?? ''
        } as CustomerDto;
      }
    }
    console.log(this.user?.picture)
  }

  ngAfterViewInit() {
    if (!this.user && typeof window !== 'undefined' && google?.accounts?.id) {
      (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);

      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (window as any).handleCredentialResponse
      });

      const btn = document.getElementById('googleBtn');
      if (btn) {
        google.accounts.id.renderButton(btn, { theme: 'outline', size: 'large' });
      }
    }
  }

  // handleCredentialResponse(response: any) {
  //   const credential = response.credential;
  //   window.onload = function() {
  //     const mobile = prompt("Enter your mobile number:");
  //     console.log("You entered:", mobile);
  //   };
  //   const mobile = prompt("Enter your mobile number:");
  //   console.log("You entered:", mobile);
  //   if (!mobile) {
  //     alert("Mobile number is required!");
  //     return;
  //   }
  //
  //   this.authService.sendGoogleCredential(credential, mobile).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       if (res.status === 'success') {
  //         this.user = res.customerDto;
  //
  //         if (typeof window !== 'undefined') {
  //           localStorage.setItem('email', res.customerDto.email);
  //           localStorage.setItem('name', res.customerDto.customerName);
  //           localStorage.setItem('profile', res.customerDto.picture);
  //           localStorage.setItem('customerId', String(res.customerDto.customerId));
  //         }
  //
  //         window.location.reload();
  //         this.router.navigate(['/home']).then(() => {
  //           console.log('Navigation success!');
  //         }).catch(err => {
  //           console.error('Navigation error:', err);
  //         });
  //       } else {
  //         console.error('Save error:', res.responseMessage);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Save error:', err);
  //     }
  //   });
  // }

  handleCredentialResponse(response: any) {
    const credential = response.credential;

    const dialogRef = this.dialog.open(MobileDialogComponent, {
      width: '400px',
      height: '250px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((mobile: string | null) => {
      if (!mobile) {
        alert('Mobile number is required!');
        return;
      }

      this.authService.sendGoogleCredential(credential, mobile).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.user = res.customerDto;

            localStorage.setItem('email', res.customerDto.email);
            localStorage.setItem('name', res.customerDto.customerName);
            localStorage.setItem('profile', res.customerDto.picture);
            localStorage.setItem('customerId', String(res.customerDto.customerId));
            window.location.reload();
            this.router.navigate(['/home']);
          } else {
            console.error('Save error:', res.responseMessage);
          }
        },
        error: (err) => console.error('Save error:', err)
      });
    });
  }

  logout() {
    this.user = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('profile');
      localStorage.removeItem('customerId');
    }

    window.location.reload();
    this.router.navigate(['/home']);
  }
}


