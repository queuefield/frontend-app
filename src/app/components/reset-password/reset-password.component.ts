import { Component, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  passwordReset = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  private token: string = '';

  // Password validation checks
  readonly hasMinLength = computed(() => {
    const pw = this.resetForm?.get('password')?.value || '';
    return pw.length >= 8;
  });

  readonly hasSpecialChar = computed(() => {
    const pw = this.resetForm?.get('password')?.value || '';
    return /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(pw);
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get token from query params (e.g. /reset-password?token=abc123)
    this.token = this.route.snapshot.queryParams['token'] || '';

    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  /**
   * Custom validator to check passwords match
   */
  private passwordsMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const password = this.resetForm.value.password;

    this.authService.resetPassword(this.token, password).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          this.passwordReset.set(true);
        } else {
          this.errorMessage.set(response.message || 'Failed to reset password.');
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'An error occurred. Please try again.');
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
