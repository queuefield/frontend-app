import { Component, computed, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AppConfigService } from '../../services/app-config.service';
import { RegexService } from '../../services/regex.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Get login configuration
  protected readonly loginMethod: string;
  protected readonly showRememberMe: boolean;
  protected readonly appName: string;

  // Computed properties for form labels
  protected readonly usernameLabel = computed(() => {
    switch (this.loginMethod) {
      case 'phone':
        return 'Phone Number';
      case 'otp':
        return 'Phone Number';
      default:
        return 'Username';
    }
  });

  protected readonly passwordLabel = computed(() => {
    return this.loginMethod === 'otp' ? 'OTP Code' : 'Password';
  });

  protected readonly usernamePlaceholder = computed(() => {
    switch (this.loginMethod) {
      case 'phone':
        return this.regexService.getPhonePlaceholder();
      case 'otp':
        return this.regexService.getPhonePlaceholder();
      default:
        return this.regexService.commonPatterns.username.placeholder;
    }
  });

  protected readonly showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private configService: AppConfigService,
    protected regexService: RegexService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginMethod = this.configService.getLoginMethod();
    this.showRememberMe = this.configService.showRememberMe();
    this.appName = this.configService.getApplicationName();
    this.loginForm = this.createForm();
  }

  /**
   * Create login form based on login method
   */
  private createForm(): FormGroup {
    const form: any = {};

    if (this.loginMethod === 'username') {
      form.username = [
        '',
        [Validators.required, Validators.pattern(this.regexService.getEmailRegex())],
      ];
      form.password = ['', [Validators.required, Validators.minLength(6)]];
    } else if (this.loginMethod === 'phone') {
      form.phone = [
        '',
        [Validators.required, Validators.pattern(this.regexService.getPhoneRegex())],
      ];
      form.password = ['', [Validators.required, Validators.minLength(6)]];
    } else if (this.loginMethod === 'otp') {
      form.phone = [
        '',
        [Validators.required, Validators.pattern(this.regexService.getPhoneRegex())],
      ];
      form.otp = ['', [Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]];
    }

    if (this.showRememberMe) {
      form.rememberMe = [false];
    }

    return this.fb.group(form);
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const formValue = this.loginForm.value;
    const loginRequest: LoginRequest = {
      username: formValue.username,
      phone: formValue.phone,
      password: formValue.password,
      otp: formValue.otp,
      rememberMe: formValue.rememberMe || false,
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          // Get return URL from query params or default to home
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        } else {
          this.errorMessage.set(response.message || 'Login failed');
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'An error occurred during login');
      },
    });
  }

  /**
   * Get form control error message
   */
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required';
    }
    if (control.errors['pattern']) {
      if (controlName === 'username') {
        return this.regexService.commonPatterns.username.errorMessage;
      }
      if (controlName === 'phone') {
        return `Please enter a valid phone number (${this.regexService.getPhoneFormat()})`;
      }
      if (controlName === 'otp') {
        return 'Please enter a valid OTP code (4-6 digits)';
      }
    }
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
    }

    return 'Invalid input';
  }
}
