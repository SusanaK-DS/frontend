import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../services/user';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  loginMessage: string | null = null;

  formName = '';
  formEmail = '';
  editingId: number | null = null;
  formVisible = false;

  loginEmail = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = null;
    this.userService.getUsers().subscribe({
      next: (list) => {
        this.users = list;
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
    this.formVisible = true;
    this.error = null;
  }

  openEdit(user: User): void {
    this.editingId = user.id;
    this.formName = user.name;
    this.formEmail = user.email;
    this.formVisible = true;
    this.error = null;
  }

  cancelForm(): void {
    this.formVisible = false;
    this.editingId = null;
    this.formName = '';
    this.formEmail = '';
  }

  save(): void {
    const name = this.formName.trim();
    const email = this.formEmail.trim();
    if (!name || !email) {
      this.error = 'Name and email are required.';
      return;
    }

    this.loading = true;
    this.error = null;

    const req =
      this.editingId === null
        ? this.userService.createUser(name, email)
        : this.userService.updateUser(this.editingId, name, email);

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

  delete(user: User): void {
    if (!confirm(`Delete user "${user.name}"?`)) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.userService.deleteUser(user.id).subscribe({
      next: () => this.refresh(),
      error: (e: Error) => {
        this.error = e.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  tryLogin(): void {
    const email = this.loginEmail.trim();
    if (!email) {
      this.loginMessage = 'Enter an email.';
      return;
    }
    this.loginMessage = null;
    this.userService.login(email).subscribe({
      next: (u) => {
        this.loginMessage = `Signed in as ${u.name} (${u.email}).`;
        this.loginEmail = '';
        this.cdr.detectChanges();
      },
      error: (e: Error) => {
        this.loginMessage = e.message;
        this.cdr.detectChanges();
      }
    });
  }
}
