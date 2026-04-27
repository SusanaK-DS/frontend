import { Routes } from '@angular/router';
import { BooksPageComponent } from './books/books-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AuthorsPageComponent } from './authors/authors-page.component';
import { ArticlesPageComponent } from './articles/articles-page.component';
import { Login } from './login/login';


export const routes: Routes = [
  { path: '', component: BooksPageComponent },
  { path: 'users', component: UserPageComponent },
  { path: 'authors', component: AuthorsPageComponent },
  { path: 'articles', component: ArticlesPageComponent },
  { path: 'login', component: Login },
];
