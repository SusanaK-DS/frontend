import { Routes } from '@angular/router';
import { BooksPageComponent } from './books/books-page.component';
import { UserPageComponent } from './user-page/user-page.component';

export const routes: Routes = [
  { path: '', component: BooksPageComponent },
  { path: 'users', component: UserPageComponent }
];
