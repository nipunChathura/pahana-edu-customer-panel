// import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';
//
// import { CartService } from '../../services/CartService';
// import { DataService } from '../../services/DataService';
// import { ConfirmDialogComponent } from '../confirm-dialog.component/confirm-dialog.component';
// import { BookDto } from '../../services/dto/BookDto';
// import { CustomerDto } from '../../services/dto/CustomerDto';
// import { OrderDto } from '../../services/dto/OrderDto';
// import { OrderDetailsDto } from '../../services/dto/OrderDetailsDto';
// import {PlaceOrderRequest} from '../../services/request/PlaceOrderRequest';
// import {Router} from '@angular/router';
// import jsPDF from 'jspdf';
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
//     ReactiveFormsModule,
//   ],
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css'],
// })
// export class CheckoutComponent implements OnInit {
//
//   cartItems: { book: BookDto; quantity: number }[] = [];
//   totalPrice = 0;
//   discountAmount = 0;
//   paidAmount = 0;
//
//   customerForm!: FormGroup;
//   paymentForm!: FormGroup;
//
//   billData: OrderDto | null = null;
//
//   private isBrowser: boolean;
//
//   constructor(
//     private cartService: CartService,
//     private fb: FormBuilder,
//     private dataService: DataService,
//     private dialog: MatDialog,
//     private router: Router,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }
//
//   ngOnInit(): void {
//     this.loadCart();
//     this.initForms();
//     this.loadStoredCustomer();
//   }
//
//   private initForms() {
//     this.customerForm = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(2)]],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', [Validators.required, Validators.pattern(/^(?:\+94|0)?7\d{8}$/)]],
//     });
//
//     this.paymentForm = this.fb.group({
//       cardHolder: ['', [Validators.required, Validators.minLength(2)]],
//       cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
//       expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
//       cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
//     });
//   }
//
//   private loadStoredCustomer() {
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
//     this.totalPrice = this.cartService.getTotalPrice();
//     this.discountAmount = this.cartItems.reduce((sum, item) => {
//       const discount = item.book.isPromotionEnable
//         ? ((item.book.price ?? 0) - (item.book.promotionPrice ?? item.book.price ?? 0)) * item.quantity
//         : 0;
//       return sum + discount;
//     }, 0);
//     this.paidAmount = this.totalPrice - this.discountAmount;
//   }
//
//   removeItem(index: number) {
//     const bookId = this.cartItems[index].book.bookId!;
//     this.cartService.removeFromCart(bookId);
//     this.loadCart();
//   }
//
//   private buildOrderDto(): OrderDto {
//     const orderDetails: OrderDetailsDto[] = this.cartItems.map(item => ({
//       orderDetailId: null,
//       orderId: null,
//       bookId: item.book.bookId!,
//       book: item.book,
//       itemPrice: item.book.price ?? 0,
//       itemQuantity: item.quantity,
//       discountPrice: item.book.isPromotionEnable
//         ? item.book.promotionPrice ?? item.book.price ?? 0
//         : item.book.price ?? 0,
//       promotionId: item.book.isPromotionEnable ? item.book.promotionId : null,
//       promotion: null,
//     }));
//
//
//     return {
//       orderId: null,
//       customerId: null,
//       customer: null,
//       orderDate: null,
//       totalAmount: this.totalPrice,
//       discountAmount: this.discountAmount,
//       paidAmount: this.paidAmount,
//       paymentType: 'CARD',
//       orderDetailDtos: orderDetails,
//     };
//   }
//
//   placeOrder() {
//     if (this.customerForm.invalid || this.paymentForm.invalid || this.cartItems.length === 0) {
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
//     dialogRef.afterClosed().subscribe(result => {
//       if (!result) return;
//       const customerValue = this.customerForm.value;
//
//       const customerDto: CustomerDto = {
//         customerId: null,
//         customerRegNo: null,
//         customerName: customerValue.name,
//         email: customerValue.email,
//         phoneNumber: customerValue.phone,
//         membershipType: null,
//         status: null,
//         picture: '',
//       };
//
//       const payload: PlaceOrderRequest = {
//         customerDto: customerDto,
//         orderDto: this.buildOrderDto(),
//       };
//
//       console.log(payload);
//
//       this.dataService.placeOrder(payload).subscribe({
//         next: response => {
//
//           if (response.status === 'success') {
//             alert('Order placed successfully!');
//             const orderId = response.orderId;
//
//             this.getOrderDetails(orderId)
//
//             // this.cartService.clearCart();
//             // this.loadCart();
//             // this.customerForm.reset();
//             // this.paymentForm.reset();
//
//             if (this.isBrowser) {
//               localStorage.setItem('name', payload.customerDto.customerName);
//               localStorage.setItem('email', payload.customerDto.email);
//             }
//
//           } else {
//             console.error('Error placing order:', response.responseMessage);
//             alert('Failed to place order. Please try again.');
//           }
//         },
//         error: (err) => {
//           console.error('Error placing order:', err);
//           alert('Failed to place order. Please try again.');
//         },
//       });
//     });
//   }
//
//   getOrderDetails(orderId: number): void {
//     this.dataService.getOrderById(orderId).subscribe({
//       next: response => {
//
//         if (response.status === 'success') {
//           this.billData = response.orderDto;
//           alert('Order placed successfully! Bill is ready below.');
//           this.cartService.clearCart();
//           this.loadCart();
//           this.customerForm.reset();
//           this.paymentForm.reset();
//         } else {
//           console.error('Error fetching bill:', response.responseMessage);
//           alert('Order placed, but failed to load bill.');
//         }
//       },
//       error: err => {
//         console.error('Error fetching bill:', err);
//         alert('Order placed, but failed to load bill.');
//       }
//     });
//   }
//
//   get canPlaceOrder(): boolean {
//     return this.customerForm.valid && this.paymentForm.valid && this.cartItems.length > 0;
//   }
//
//   downloadBill() {
//     if (!this.billData) return;
//
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Invoice / Bill", 20, 20);
//
//     doc.setFontSize(12);
//     doc.text(`Order ID: ${this.billData.orderId}`, 20, 40);
//     doc.text(`Customer: ${this.billData.customer?.customerName}`, 20, 50);
//     doc.text(`Email: ${this.billData.customer?.email}`, 20, 60);
//     doc.text(`Phone: ${this.billData.customer?.phoneNumber}`, 20, 70);
//
//     let y = 90;
//     this.billData.orderDetailDtos.forEach((item: any, index: number) => {
//       const title = item.book?.name || item.book.title || 'Book';
//       doc.text(`${index + 1}. ${title} x ${item.itemQuantity} = Rs.${item.discountPrice}`, 20, y);
//       y += 10;
//     });
//
//     y += 10;
//     doc.text(`Total Paid: Rs.${this.billData.paidAmount}`, 20, y);
//
//     doc.save(`Bill_Order_${this.billData.orderId}.pdf`);
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
import { PlaceOrderRequest } from '../../services/request/PlaceOrderRequest';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  paidPrice = 0;
  totalAmount = 0;
  discountPrice = 0;
  showDetails: boolean = true;


  customerForm!: FormGroup;
  paymentForm!: FormGroup;

  billData: OrderDto | null = null;

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
    this.paidPrice = this.cartService.getTotalPrice();
    this.totalAmount = this.cartItems.reduce((sum, item) => {
      const discount = item.book.promotionEnable
        ? ((item.book.price ?? 0) - (item.book.promotionPrice ?? item.book.price ?? 0)) * item.quantity
        : (item.book.price ?? 0);
      return sum + discount;
    }, 0);
    this.discountPrice = this.totalAmount - this.paidPrice ;
    console.log('discountPrice '+ this.discountPrice);
    console.log('paidPrice '+ this.paidPrice);
    console.log('totalAmount '+ this.totalAmount);
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
      discountPrice: item.book.promotionEnable
        ? item.book.promotionBookPrice ?? item.book.price ?? 0
        : item.book.price ?? 0,
      promotionId: item.book.promotionEnable ? item.book.promotionId : null,
      promotion: null,
    }));

    return {
      orderId: null,
      customerId: null,
      customer: null,
      orderDate: null,
      totalAmount: this.totalAmount,
      discountAmount: this.discountPrice,
      paidAmount: this.paidPrice,
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

      this.dataService.placeOrder(payload).subscribe({
        next: response => {
          if (response.status === 'success') {
            const orderId = response.orderId;
            this.getOrderDetails(orderId);

            if (this.isBrowser) {
              localStorage.setItem('name', payload.customerDto.customerName);
              localStorage.setItem('email', payload.customerDto.email);
            }

          } else {
            console.error('Error placing order:', response.responseMessage);
            alert('Failed to place order. Please try again.');
          }
        },
        error: err => {
          console.error('Error placing order:', err);
          alert('Failed to place order. Please try again.');
        },
      });
    });
  }

  getOrderDetails(orderId: number): void {
    this.dataService.getOrderById(orderId).subscribe({
      next: response => {
        if (response.status === 'success') {
          this.billData = response.orderDto;
          alert('Order placed successfully! Bill is ready.');
          console.log('this.billData.totalAmount ' + this.billData.totalAmount)
          console.log('this.billData.paidAmount ' + this.billData.paidAmount)
          console.log('this.billData.discountAmount ' + this.billData.discountAmount)
          this.showDetails = false;
          this.cartService.clearCart();
          this.cartItems = [];
          this.customerForm.reset();
          this.paymentForm.reset();
        } else {
          console.error('Error fetching bill:', response.responseMessage);
          alert('Order placed, but failed to load bill.');
        }
      },
      error: err => {
        console.error('Error fetching bill:', err);
        alert('Order placed, but failed to load bill.');
      }
    });
  }

  get canPlaceOrder(): boolean {
    return this.customerForm.valid && this.paymentForm.valid && this.cartItems.length > 0;
  }

  // downloadBill() {
  //   if (!this.billData) return;
  //
  //   const doc = new jsPDF();
  //   doc.setFontSize(16);
  //   doc.text("Invoice / Bill", 105, 20, { align: "center" });
  //
  //   doc.setFontSize(12);
  //   const customer = this.billData.customer;
  //   doc.text(`Order ID: ${this.billData.orderId}`, 20, 40);
  //   doc.text(`Customer: ${customer?.customerName}`, 20, 50);
  //   doc.text(`Customer Reg No: ${customer?.customerRegNo}`, 20, 60);
  //   doc.text(`Email: ${customer?.email}`, 20, 70);
  //   doc.text(`Phone: ${customer?.phoneNumber}`, 20, 80);
  //   doc.text(`Payment Type: ${this.billData.paymentType}`, 20, 90);
  //
  //   let y = 110;
  //   doc.text("Items:", 20, y);
  //   y += 10;
  //   this.billData.orderDetailDtos.forEach((item, index) => {
  //     const line = `${index + 1}. ${item.book?.name} x ${item.itemQuantity} = Rs.${item.discountPrice}`;
  //     doc.text(line, 25, y);
  //     y += 10;
  //   });
  //
  //   y += 10;
  //   doc.text(`Total Amount: Rs.${this.billData.totalAmount}`, 20, y);
  //   doc.text(`Discount: Rs.${this.billData.discountAmount}`, 20, y + 10);
  //   doc.text(`Paid: Rs.${this.billData.paidAmount}`, 20, y + 20);
  //
  //   doc.save(`Bill_Order_${this.billData.orderId}.pdf`);
  // }

  async downloadBill() {
    if (!this.billData) return;

    const doc = new jsPDF();

    const logoBase64 = await this.getBase64ImageFromURL('/assets/pahana-edu-logo.jpg');
    const logoWidth = 30;
    const logoHeight = 30;
    doc.addImage(logoBase64, 'PNG', 15, 15, logoWidth, logoHeight);

    // === Page Border ===
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // === Shop Header ===
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Pahana Edu Bookshop", pageWidth / 2, 25, {align: "center"});

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("123 Main Street, Colombo, Sri Lanka", pageWidth / 2, 32, {align: "center"});
    doc.text("Tel: +94 77 123 4567 | Email: info@pahanaedu.lk", pageWidth / 2, 38, {align: "center"});

    // === Invoice Title ===
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE / BILL", pageWidth / 2, 50, {align: "center"});

    // === Customer & Order Info ===
    const customer = this.billData.customer;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Order ID: ${this.billData.orderId}`, 20, 65);
    doc.text(`Customer: ${customer?.customerName}`, 20, 72);
    doc.text(`Customer Reg No: ${customer?.customerRegNo}`, 20, 79);
    doc.text(`Email: ${customer?.email}`, 20, 86);
    doc.text(`Phone: ${customer?.phoneNumber}`, 20, 93);

    doc.text(`Payment Type: ${this.billData.paymentType}`, pageWidth - 80, 65);

    // === Table Data ===
    const tableData = this.billData.orderDetailDtos.map((item, index) => {
      const qty = item.itemQuantity ?? 0;
      const itemPrice = item.itemPrice ?? 0;
      const discount = item.discountPrice ?? 0;

      // Subtotal (Qty × Item Price – Discount)
      const subtotal = (qty * itemPrice) - discount;

      return [
        index + 1,
        item.book?.name || "",
        qty,
        `Rs. ${itemPrice.toFixed(2)}`,
        `Rs. ${discount.toFixed(2)}`,
        `Rs. ${subtotal.toFixed(2)}`
      ];
    });

    autoTable(doc, {
      startY: 105,
      head: [["#", "Book", "Qty", "Item Price", "Discount", "Subtotal"]],
      body: tableData,
      theme: "grid",
      styles: {fontSize: 11, cellPadding: 4},
      headStyles: {fillColor: [41, 128, 185], textColor: 255, halign: "center"},
      columnStyles: {
        0: {halign: "center", cellWidth: 10},
        1: {cellWidth: 50},
        2: {halign: "center", cellWidth: 15},
        3: {halign: "right", cellWidth: 30},
        4: {halign: "right", cellWidth: 30},
        5: {halign: "right", cellWidth: 35}
      },
      margin: {left: 15, right: 15}
    });

    // === Summary Section (Box Style) ===
    let finalY = (doc as any).lastAutoTable.finalY || 120;
    // doc.setFontSize(12);
    // doc.setFont("helvetica", "bold");

    // doc.rect(pageWidth - 80, finalY + 10, 60, 30); // summary box border
    // doc.text("Summary", pageWidth - 50, finalY + 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Total: Rs.${this.billData.totalAmount} /=`, pageWidth - 75, finalY + 28);
    doc.text(`Discount: Rs.${this.billData.discountAmount} /=`, pageWidth - 75, finalY + 36);
    doc.text(`Paid: Rs.${this.billData.paidAmount} /=`, pageWidth - 75, finalY + 44);

    // === Footer ===
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for shopping with us!", pageWidth / 2, pageHeight - 15, {align: "center"});

    doc.save(`Bill_Order_${this.billData.orderId}.pdf`);
  }

  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous'); // to avoid CORS issues
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
    });
  }

}
