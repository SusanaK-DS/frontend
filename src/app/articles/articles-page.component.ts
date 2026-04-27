import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Article, ArticleService } from '../services/article.service';

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articles-page.component.html',
  styleUrl: './articles-page.component.css'
})
export class ArticlesPageComponent implements OnInit {
  articles: Article[] = [];
  loading = false;
  error: string | null = null;

  formTitle = '';
  formAuthor = '';
  formPublishedDate = '';
  editingId: number | null = null;
  formVisible = false;

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = null;
    this.articleService.getArticles().subscribe({
      next: (list) => {
        this.articles = list;
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
    this.formPublishedDate = '';
    this.formVisible = true;
    this.error = null;
  }

  openEdit(article: Article): void {
    this.editingId = article.id;
    this.formTitle = article.title;
    this.formAuthor = article.author;
    this.formPublishedDate = article.publishedDate ? article.publishedDate.substring(0, 10) : '';
    this.formVisible = true;
    this.error = null;
  }

  cancelForm(): void {
    this.formVisible = false;
    this.editingId = null;
    this.formTitle = '';
    this.formAuthor = '';
    this.formPublishedDate = '';
  }

  save(): void {
    const title = this.formTitle.trim();
    const author = this.formAuthor.trim();
    const publishedDate = this.formPublishedDate;
    if (!title || !author || !publishedDate) {
      this.error = 'Title, author, and published date are required.';
      return;
    }

    this.loading = true;
    this.error = null;

    const req =
      this.editingId === null
        ? this.articleService.createArticle(title, author, publishedDate)
        : this.articleService.updateArticle(this.editingId, title, author, publishedDate);

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

  delete(article: Article): void {
    if (!confirm(`Delete "${article.title}"?`)) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.articleService.deleteArticle(article.id).subscribe({
      next: () => this.refresh(),
      error: (e: Error) => {
        this.error = e.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
