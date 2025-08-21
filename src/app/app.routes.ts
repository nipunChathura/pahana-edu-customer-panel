// import { Routes } from '@angular/router';
//
// import {HomeComponent} from './pages/home.component/home.component';
//
// export const routes: Routes = [
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: 'home', component: HomeComponent }
// ];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component/home.component';
import {AboutComponent} from './pages/about.component/about.component';
import {BookListComponent} from './pages/book-list.component/book-list.component';
import {CheckoutComponent} from './pages/checkout.component/checkout.component';
import {HelpComponent} from './pages/help.component/help.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  // { path: 'book/:name', component: BookListComponent },
  { path: 'book/:type/:id', component: BookListComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
