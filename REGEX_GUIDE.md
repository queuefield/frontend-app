# Regex and Validation Service Guide

## Overview
The `RegexService` provides centralized validation patterns and placeholders that automatically adapt based on your application's country configuration. This ensures consistent validation across your entire application and makes it easy to support multiple countries.

## Features

### Country-Specific Validation
- **Phone Numbers** - Different formats for each country (e.g., +20 for Egypt, +971 for UAE)
- **Postal/ZIP Codes** - Country-specific formats
- **National IDs** - SSN, Emirates ID, etc.
- **Tax IDs** - EIN, TRN, VAT numbers
- **Date Formats** - MM/DD/YYYY vs DD/MM/YYYY
- **Currency** - Symbols and codes

### Common Validation Patterns
- Email addresses
- URLs
- Usernames
- Passwords
- Alphanumeric, alphabetic, numeric values
- Decimal numbers

### Supported Countries
- 🇺🇸 **United States (US)** - Phone: +1, Date: MM/DD/YYYY, Currency: USD ($)
- 🇪🇬 **Egypt (EG)** - Phone: +20, Date: DD/MM/YYYY, Currency: EGP (E£)
- 🇦🇪 **UAE (AE)** - Phone: +971, Date: DD/MM/YYYY, Currency: AED (د.إ)
- 🇸🇦 **Saudi Arabia (SA)** - Phone: +966, Date: DD/MM/YYYY, Currency: SAR (﷼)
- 🇬🇧 **United Kingdom (GB)** - Phone: +44, Date: DD/MM/YYYY, Currency: GBP (£)

## Usage

### Inject the Service

```typescript
import { RegexService } from './services/regex.service';

export class MyComponent {
  constructor(protected regexService: RegexService) {}
}
```

### Phone Number Validation

```typescript
// Get phone placeholder based on current country
const phonePlaceholder = this.regexService.getPhonePlaceholder();
// Egypt: "+20 10 1234 5678"
// UAE: "+971 50 123 4567"
// US: "+1 (555) 123-4567"

// Get phone regex pattern
const phoneRegex = this.regexService.getPhoneRegex();

// Validate phone number
const isValid = this.regexService.validatePhone('+20 10 1234 5678');

// Get phone code
const phoneCode = this.regexService.getPhoneCode(); // "+20" for Egypt

// Format phone number
const formatted = this.regexService.formatPhoneNumber('1012345678');
// Returns: "+20 1012345678" (adds country code)
```

### In HTML Templates

```html
<!-- Phone input with dynamic placeholder -->
<input 
  type="tel" 
  [placeholder]="regexService.getPhonePlaceholder()"
  [pattern]="regexService.getPhoneRegex().source"
/>

<!-- Postal code input -->
<input 
  type="text" 
  [placeholder]="regexService.getPostalCodePlaceholder()"
  [pattern]="regexService.getPostalCodeRegex().source"
/>

<!-- Date input -->
<input 
  type="text" 
  [placeholder]="regexService.getDatePlaceholder()"
  [pattern]="regexService.getDateRegex().source"
/>

<!-- Email input (common pattern) -->
<input 
  type="email" 
  [placeholder]="regexService.getEmailPlaceholder()"
  [pattern]="regexService.getEmailRegex().source"
/>
```

### Reactive Forms Validation

```typescript
import { FormBuilder, Validators } from '@angular/forms';

export class MyFormComponent {
  form = this.fb.group({
    phone: ['', [
      Validators.required,
      Validators.pattern(this.regexService.getPhoneRegex())
    ]],
    email: ['', [
      Validators.required,
      Validators.pattern(this.regexService.getEmailRegex())
    ]],
    postalCode: ['', [
      Validators.required,
      Validators.pattern(this.regexService.getPostalCodeRegex())
    ]],
    nationalId: ['', [
      Validators.pattern(this.regexService.getNationalIdRegex() || /./)
    ]]
  });

  constructor(
    private fb: FormBuilder,
    private regexService: RegexService
  ) {}
}
```

### All Available Methods

#### Phone Number Methods
```typescript
getPhoneRegex(): RegExp
getPhonePlaceholder(): string
getPhoneFormat(): string
validatePhone(phone: string): boolean
getPhoneCode(): string
formatPhoneNumber(phone: string): string
```

#### Postal Code Methods
```typescript
getPostalCodeRegex(): RegExp
getPostalCodePlaceholder(): string
validatePostalCode(postalCode: string): boolean
```

#### National ID Methods
```typescript
getNationalIdRegex(): RegExp | null
getNationalIdPlaceholder(): string
validateNationalId(nationalId: string): boolean
```

#### Tax ID Methods
```typescript
getTaxIdRegex(): RegExp | null
getTaxIdPlaceholder(): string
validateTaxId(taxId: string): boolean
```

#### Date Methods
```typescript
getDateFormat(): string
getDatePlaceholder(): string
getDateRegex(): RegExp
validateDate(date: string): boolean
```

#### Currency Methods
```typescript
getCurrencyCode(): string
getCurrencySymbol(): string
```

#### Common Pattern Methods
```typescript
getEmailRegex(): RegExp
getEmailPlaceholder(): string
validateEmail(email: string): boolean

getUrlRegex(): RegExp
validateUrl(url: string): boolean

getUsernameRegex(): RegExp
validateUsername(username: string): boolean

getPasswordRegex(): RegExp
validatePassword(password: string): boolean

validateAlphanumeric(value: string): boolean
validateAlphabetic(value: string): boolean
validateNumeric(value: string): boolean
validateDecimal(value: string): boolean

getErrorMessage(validationType: string): string
```

## Country-Specific Patterns

### Egypt (EG)
```typescript
{
  phoneCode: '+20',
  phonePlaceholder: '+20 10 1234 5678',
  phoneRegex: '^\\+20[1-9][0-9]{8,9}$',
  
  postalCodePlaceholder: '12345',
  postalCodeRegex: '^[0-9]{5}$',
  
  nationalIdPlaceholder: '12345678901234',
  nationalIdRegex: '^[0-9]{14}$', // 14 digits
  
  taxIdPlaceholder: '123456789',
  taxIdRegex: '^[0-9]{9}$', // 9 digits
  
  dateFormat: 'DD/MM/YYYY',
  currencyCode: 'EGP',
  currencySymbol: 'E£'
}
```

### United Arab Emirates (AE)
```typescript
{
  phoneCode: '+971',
  phonePlaceholder: '+971 50 123 4567',
  phoneRegex: '^\\+971[2-9][0-9]{7,8}$',
  
  postalCodePlaceholder: '12345',
  postalCodeRegex: '^[0-9]{5}$',
  
  nationalIdPlaceholder: '784-1234-1234567-1',
  nationalIdRegex: '^784-[0-9]{4}-[0-9]{7}-[0-9]$', // Emirates ID
  
  taxIdPlaceholder: '123456789012345',
  taxIdRegex: '^[0-9]{15}$', // TRN
  
  dateFormat: 'DD/MM/YYYY',
  currencyCode: 'AED',
  currencySymbol: 'د.إ'
}
```

### United States (US)
```typescript
{
  phoneCode: '+1',
  phonePlaceholder: '+1 (555) 123-4567',
  phoneRegex: '^\\+1[2-9][0-9]{9}$',
  
  postalCodePlaceholder: '12345 or 12345-6789',
  postalCodeRegex: '^[0-9]{5}(-[0-9]{4})?$',
  
  nationalIdPlaceholder: '123-45-6789',
  nationalIdRegex: '^[0-9]{3}-[0-9]{2}-[0-9]{4}$', // SSN
  
  taxIdPlaceholder: '12-3456789',
  taxIdRegex: '^[0-9]{2}-[0-9]{7}$', // EIN
  
  dateFormat: 'MM/DD/YYYY',
  currencyCode: 'USD',
  currencySymbol: '$'
}
```

## Complete Form Example

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegexService } from '../../services/regex.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <!-- Email -->
      <div class="form-group">
        <label>Email</label>
        <input 
          type="email" 
          formControlName="email"
          [placeholder]="regexService.getEmailPlaceholder()"
        />
        <span class="error" *ngIf="registrationForm.get('email')?.invalid && registrationForm.get('email')?.touched">
          {{ regexService.getErrorMessage('email') }}
        </span>
      </div>

      <!-- Phone -->
      <div class="form-group">
        <label>Phone ({{ regexService.getPhoneFormat() }})</label>
        <input 
          type="tel" 
          formControlName="phone"
          [placeholder]="regexService.getPhonePlaceholder()"
        />
        <span class="hint">Format: {{ regexService.getPhoneFormat() }}</span>
      </div>

      <!-- Postal Code -->
      <div class="form-group">
        <label>Postal Code</label>
        <input 
          type="text" 
          formControlName="postalCode"
          [placeholder]="regexService.getPostalCodePlaceholder()"
        />
      </div>

      <!-- National ID -->
      <div class="form-group">
        <label>National ID</label>
        <input 
          type="text" 
          formControlName="nationalId"
          [placeholder]="regexService.getNationalIdPlaceholder()"
        />
        <span class="hint">{{ regexService.getCurrentCountryRules().nationalIdFormat }}</span>
      </div>

      <!-- Date of Birth -->
      <div class="form-group">
        <label>Date of Birth ({{ regexService.getDateFormat() }})</label>
        <input 
          type="text" 
          formControlName="dateOfBirth"
          [placeholder]="regexService.getDatePlaceholder()"
        />
      </div>

      <button type="submit" [disabled]="registrationForm.invalid">Submit</button>
    </form>
  `
})
export class RegistrationFormComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected regexService: RegexService
  ) {
    this.registrationForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(this.regexService.getEmailRegex())
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(this.regexService.getPhoneRegex())
      ]],
      postalCode: ['', [
        Validators.required,
        Validators.pattern(this.regexService.getPostalCodeRegex())
      ]],
      nationalId: ['', [
        Validators.pattern(this.regexService.getNationalIdRegex() || /./)
      ]],
      dateOfBirth: ['', [
        Validators.required,
        Validators.pattern(this.regexService.getDateRegex())
      ]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form data:', this.registrationForm.value);
    }
  }
}
```

## Adding New Countries

To add support for a new country, update the `initializeCountryRules()` method in `regex.service.ts`:

```typescript
// France example
this.countryRules.set('FR', {
  countryCode: 'FR',
  countryName: 'France',
  phoneCode: '+33',
  phoneRegex: '^\\+33[1-9][0-9]{8}$',
  phonePlaceholder: '+33 1 23 45 67 89',
  phoneFormat: '+33 X XX XX XX XX',
  phoneMinLength: 13,
  phoneMaxLength: 13,
  postalCodeRegex: '^[0-9]{5}$',
  postalCodePlaceholder: '75001',
  postalCodeFormat: 'XXXXX',
  dateFormat: 'DD/MM/YYYY',
  dateRegex: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/[0-9]{4}$',
  datePlaceholder: 'DD/MM/YYYY',
  currencyCode: 'EUR',
  currencySymbol: '€'
});
```

## Best Practices

1. **Always use the service** - Don't hardcode regex patterns or placeholders
2. **Show format hints** - Display the expected format to users
3. **Provide clear error messages** - Use `getErrorMessage()` for consistent messaging
4. **Test with real data** - Validate patterns with actual phone numbers from each country
5. **Handle optional fields** - Use `|| /./` for optional patterns that might be null
6. **Format on submit** - Use `formatPhoneNumber()` to ensure consistent storage

## Common Validation Patterns

### Email
- Pattern: Standard RFC 5322 compliant
- Example: `user@example.com`

### URL
- Pattern: HTTP/HTTPS URLs with optional www
- Example: `https://example.com`

### Username
- Pattern: 3-20 characters, letters, numbers, underscore, hyphen
- Example: `john_doe-123`

### Password
- Pattern: Minimum 8 characters, must include:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

## Summary

The RegexService provides:
- ✅ **Country-specific validation** based on app configuration
- ✅ **Automatic placeholders** that match country formats
- ✅ **Centralized patterns** for consistent validation
- ✅ **Type-safe** with TypeScript interfaces
- ✅ **Easy to extend** with new countries
- ✅ **Common patterns** for email, URL, username, password
- ✅ **Format helpers** for phone numbers and dates

This service ensures your application automatically adapts to different countries without code changes - just update the `config.json` file!
