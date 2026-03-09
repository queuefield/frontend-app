import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegexService } from '../../services/regex.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  emailSent = signal(false);
  submittedEmail = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private regexService: RegexService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.regexService.getEmailRegex())]],
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const email = this.forgotForm.value.email;
    this.sendResetEmail(email);
  }

  resendEmail(): void {
    const email = this.submittedEmail();
    if (email) {
      this.sendResetEmail(email);
    }
  }

  private sendResetEmail(email: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          this.submittedEmail.set(email);
          this.emailSent.set(true);
        } else {
          this.errorMessage.set(response.message || 'Failed to send reset instructions.');
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'An error occurred. Please try again.');
      },
    });
  }
}
