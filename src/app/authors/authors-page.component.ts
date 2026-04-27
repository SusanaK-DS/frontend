import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Author, AuthorService } from '../services/author.service';

@Component({
  selector: 'app-authors-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './authors-page.component.html',
  styleUrl: './authors-page.component.css'
})
export class AuthorsPageComponent implements OnInit {
  authors: Author[] = [];
  loading = false;
  error: string | null = null;

  formName = '';
  formEmail = '';
  formBirthDate = '';
  editingId: number | null = null;
  formVisible = false;

  constructor(
    private authorService: AuthorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = null;
    this.authorService.getAuthors().subscribe({
      next: (list) => {
        this.authors = list;
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
    this.formName = '';
    this.formEmail = '';
    this.formBirthDate = '';
    this.formVisible = true;
    this.error = null;
  }

  openEdit(author: Author): void {
    this.editingId = author.id;
    this.formName = author.name;
    this.formEmail = author.email;
    this.formBirthDate = author.birthDate ? author.birthDate.substring(0, 10) : '';
    this.formVisible = true;
    this.error = null;
  }

  cancelForm(): void {
    this.formVisible = false;
    this.editingId = null;
    this.formName = '';
    this.formEmail = '';
    this.formBirthDate = '';
  }

  save(): void {
    const name = this.formName.trim();
    const email = this.formEmail.trim();
    const birthDate = this.formBirthDate;

    if (!name || !email || !birthDate) {
      this.error = 'Name, email, and birth date are required.';
      return;
    }

    this.loading = true;
    this.error = null;

    const req =
      this.editingId === null
        ? this.authorService.createAuthor(name, email, birthDate)
        : this.authorService.updateAuthor(this.editingId, name, email, birthDate);

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

  delete(author: Author): void {
    if (!confirm(`Delete "${author.name}"?`)) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.authorService.deleteAuthor(author.id).subscribe({
      next: () => this.refresh(),
      error: (e: Error) => {
        this.error = e.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
