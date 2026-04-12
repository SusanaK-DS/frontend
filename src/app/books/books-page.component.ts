import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, BookService } from '../services/book.service';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.css'
})
export class BooksPageComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  error: string | null = null;

  formTitle = '';
  formAuthor = '';
  editingId: number | null = null;
  formVisible = false;

  constructor(
    private bookService: BookService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = null;
    this.bookService.getBooks().subscribe({
      next: (list) => {
        this.books = list;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.formTitle = '';
    this.formAuthor = '';
    this.formVisible = true;
    this.error = null;
  }

  openEdit(book: Book): void {
    this.editingId = book.id;
    this.formTitle = book.title;
    this.formAuthor = book.author;
    this.formVisible = true;
    this.error = null;
  }

  cancelForm(): void {
    this.formVisible = false;
    this.editingId = null;
    this.formTitle = '';
    this.formAuthor = '';
  }

  save(): void {
    const title = this.formTitle.trim();
    const author = this.formAuthor.trim();
    if (!title || !author) {
      this.error = 'Title and author are required.';
      return;
    }

    this.loading = true;
    this.error = null;

    const req =
      this.editingId === null
        ? this.bookService.createBook(title, author)
        : this.bookService.updateBook(this.editingId, title, author);

    req.subscribe({
      next: () => {
        this.cancelForm();
        this.refresh();
        this.cdr.detectChanges();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  delete(book: Book): void {
    if (!confirm(`Delete "${book.title}"?`)) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.bookService.deleteBook(book.id).subscribe({
      next: () => this.refresh(),
      error: (e: Error) => {
        this.error = e.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
