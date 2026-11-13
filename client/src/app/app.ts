import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { AuthService } from './auth.service';

@Component({
  imports: [RouterOutlet, Navbar],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly auth = inject(AuthService);

  protected readonly title = signal('rank-anything');
  protected readonly showWelcome = signal(false);

  closeWelcome(): void {
    this.showWelcome.set(false);
  }

  ngOnInit(): void {
    this.auth.loadMe().subscribe({
      next: (response) => {
        this.auth.user.set(response.user);
        this.auth.loading.set(false);
        this.showWelcome.set(response.user.newUser);
      },
      error: (error) => {
        console.error('User error', error);
        this.auth.loading.set(false);
      }
    })
  }
}
