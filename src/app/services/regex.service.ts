import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { CountryValidationRules, CommonValidationPatterns } from '../models/validation.model';

@Injectable({
  providedIn: 'root'
})
export class RegexService {
  private countryRules: Map<string, CountryValidationRules> = new Map();
  private currentCountryRules: CountryValidationRules | null = null;

  // Common validation patterns (country-independent)
  readonly commonPatterns: CommonValidationPatterns = {
    email: {
      regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      placeholder: 'example@email.com',
      errorMessage: 'Please enter a valid email address'
    },
    url: {
      regex: '^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
      placeholder: 'https://example.com',
      errorMessage: 'Please enter a valid URL'
    },
    username: {
      regex: '^[a-zA-Z0-9_-]{3,20}$',
      placeholder: 'username',
      minLength: 3,
      maxLength: 20,
      errorMessage: 'Username must be 3-20 characters (letters, numbers, _, -)'
    },
    password: {
      regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
      placeholder: '••••••••',
      minLength: 8,
      maxLength: 128,
      errorMessage: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    },
    alphanumeric: {
      regex: '^[a-zA-Z0-9]+$',
      errorMessage: 'Only letters and numbers are allowed'
    },
    alphabetic: {
      regex: '^[a-zA-Z\\s]+$',
      errorMessage: 'Only letters are allowed'
    },
    numeric: {
      regex: '^[0-9]+$',
      errorMessage: 'Only numbers are allowed'
    },
    decimal: {
      regex: '^[0-9]+(\\.[0-9]{1,2})?$',
      errorMessage: 'Please enter a valid decimal number'
    }
  };

  constructor(private configService: AppConfigService) {
    this.initializeCountryRules();
    this.setCurrentCountry();
  }

  /**
   * Initialize validation rules for all supported countries
   */
  private initializeCountryRules(): void {
    // United States
    this.countryRules.set('US', {
      countryCode: 'US',
      countryName: 'United States',
      phoneCode: '+1',
      phoneRegex: '^\\+1[2-9][0-9]{9}$',
      phonePlaceholder: '+1 (555) 123-4567',
      phoneFormat: '+1 (XXX) XXX-XXXX',
      phoneMinLength: 12,
      phoneMaxLength: 12,
      postalCodeRegex: '^[0-9]{5}(-[0-9]{4})?$',
      postalCodePlaceholder: '12345 or 12345-6789',
      postalCodeFormat: 'XXXXX or XXXXX-XXXX',
      nationalIdRegex: '^[0-9]{3}-[0-9]{2}-[0-9]{4}$',
      nationalIdPlaceholder: '123-45-6789',
      nationalIdFormat: 'XXX-XX-XXXX (SSN)',
      taxIdRegex: '^[0-9]{2}-[0-9]{7}$',
      taxIdPlaceholder: '12-3456789',
      taxIdFormat: 'XX-XXXXXXX (EIN)',
      dateFormat: 'MM/DD/YYYY',
      dateRegex: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/[0-9]{4}$',
      datePlaceholder: 'MM/DD/YYYY',
      currencyCode: 'USD',
      currencySymbol: '$'
    });

    // Egypt
    this.countryRules.set('EG', {
      countryCode: 'EG',
      countryName: 'Egypt',
      phoneCode: '+20',
      phoneRegex: '^\\+20[1-9][0-9]{8,9}$',
      phonePlaceholder: '+20 10 1234 5678',
      phoneFormat: '+20 XX XXXX XXXX',
      phoneMinLength: 13,
      phoneMaxLength: 14,
      postalCodeRegex: '^[0-9]{5}$',
      postalCodePlaceholder: '12345',
      postalCodeFormat: 'XXXXX',
      nationalIdRegex: '^[0-9]{14}$',
      nationalIdPlaceholder: '12345678901234',
      nationalIdFormat: 'XXXXXXXXXXXXXX (14 digits)',
      taxIdRegex: '^[0-9]{9}$',
      taxIdPlaceholder: '123456789',
      taxIdFormat: 'XXXXXXXXX (9 digits)',
      dateFormat: 'DD/MM/YYYY',
      dateRegex: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/[0-9]{4}$',
      datePlaceholder: 'DD/MM/YYYY',
      currencyCode: 'EGP',
      currencySymbol: 'E£'
    });

    // United Arab Emirates
    this.countryRules.set('AE', {
      countryCode: 'AE',
      countryName: 'United Arab Emirates',
      phoneCode: '+971',
      phoneRegex: '^\\+971[2-9][0-9]{7,8}$',
      phonePlaceholder: '+971 50 123 4567',
      phoneFormat: '+971 XX XXX XXXX',
      phoneMinLength: 13,
      phoneMaxLength: 14,
      postalCodeRegex: '^[0-9]{5}$',
      postalCodePlaceholder: '12345',
      postalCodeFormat: 'XXXXX',
      nationalIdRegex: '^784-[0-9]{4}-[0-9]{7}-[0-9]$',
      nationalIdPlaceholder: '784-1234-1234567-1',
      nationalIdFormat: '784-XXXX-XXXXXXX-X (Emirates ID)',
      taxIdRegex: '^[0-9]{15}$',
      taxIdPlaceholder: '123456789012345',
      taxIdFormat: 'XXXXXXXXXXXXXXX (TRN)',
      dateFormat: 'DD/MM/YYYY',
      dateRegex: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/[0-9]{4}$',
      datePlaceholder: 'DD/MM/YYYY',
      currencyCode: 'AED',
      currencySymbol: 'د.إ'
    });

    // Saudi Arabia
    this.countryRules.set('SA', {
      countryCode: 'SA',
      countryName: 'Saudi Arabia',
      phoneCode: '+966',
      phoneRegex: '^\\+966[5][0-9]{8}$',
      phonePlaceholder: '+966 50 123 4567',
      phoneFormat: '+966 XX XXX XXXX',
      phoneMinLength: 13,
      phoneMaxLength: 13,
      postalCodeRegex: '^[0-9]{5}(-[0-9]{4})?$',
      postalCodePlaceholder: '12345 or 12345-1234',
      postalCodeFormat: 'XXXXX or XXXXX-XXXX',
      nationalIdRegex: '^[12][0-9]{9}$',
      nationalIdPlaceholder: '1234567890',
      nationalIdFormat: 'XXXXXXXXXX (10 digits)',
      taxIdRegex: '^[0-9]{15}$',
      taxIdPlaceholder: '123456789012345',
      taxIdFormat: 'XXXXXXXXXXXXXXX (VAT)',
      dateFormat: 'DD/MM/YYYY',
      dateRegex: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/[0-9]{4}$',
      datePlaceholder: 'DD/MM/YYYY',
      currencyCode: 'SAR',
      currencySymbol: '﷼'
    });

    // United Kingdom
    this.countryRules.set('GB', {
      countryCode: 'GB',
      countryName: 'United Kingdom',
      phoneCode: '+44',
      phoneRegex: '^\\+44[1-9][0-9]{9,10}$',
      phonePlaceholder: '+44 20 1234 5678',
      phoneFormat: '+44 XX XXXX XXXX',
      phoneMinLength: 13,
      phoneMaxLength: 14,
      postalCodeRegex: '^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$',
      postalCodePlaceholder: 'SW1A 1AA',
      postalCodeFormat: 'XX## #XX',
      nationalIdRegex: '^[A-Z]{2}[0-9]{6}[A-Z]$',
      nationalIdPlaceholder: 'AB123456C',
      nationalIdFormat: 'XX######X (NI Number)',
      taxIdRegex: '^[0-9]{10}$',
      taxIdPlaceholder: '1234567890',
      taxIdFormat: 'XXXXXXXXXX (UTR)',
      dateFormat: 'DD/MM/YYYY',
      dateRegex: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/[0-9]{4}$',
      datePlaceholder: 'DD/MM/YYYY',
      currencyCode: 'GBP',
      currencySymbol: '£'
    });
  }

  /**
   * Set current country rules based on app configuration
   */
  private setCurrentCountry(): void {
    const countryCode = this.configService.getCountry();
    this.currentCountryRules = this.countryRules.get(countryCode) || this.countryRules.get('US')!;
  }

  /**
   * Get current country validation rules
   */
  getCurrentCountryRules(): CountryValidationRules {
    if (!this.currentCountryRules) {
      this.setCurrentCountry();
    }
    return this.currentCountryRules!;
  }

  /**
   * Get rules for a specific country
   */
  getCountryRules(countryCode: string): CountryValidationRules | undefined {
    return this.countryRules.get(countryCode);
  }

  /**
   * Get all available country codes
   */
  getAvailableCountries(): string[] {
    return Array.from(this.countryRules.keys());
  }

  // ==================== Phone Number Methods ====================

  /**
   * Get phone regex pattern for current country
   */
  getPhoneRegex(): RegExp {
    return new RegExp(this.getCurrentCountryRules().phoneRegex);
  }

  /**
   * Get phone placeholder for current country
   */
  getPhonePlaceholder(): string {
    return this.getCurrentCountryRules().phonePlaceholder;
  }

  /**
   * Get phone format description for current country
   */
  getPhoneFormat(): string {
    return this.getCurrentCountryRules().phoneFormat;
  }

  /**
   * Validate phone number for current country
   */
  validatePhone(phone: string): boolean {
    return this.getPhoneRegex().test(phone);
  }

  /**
   * Get phone code for current country
   */
  getPhoneCode(): string {
    return this.getCurrentCountryRules().phoneCode;
  }

  // ==================== Postal Code Methods ====================

  /**
   * Get postal code regex pattern for current country
   */
  getPostalCodeRegex(): RegExp {
    return new RegExp(this.getCurrentCountryRules().postalCodeRegex);
  }

  /**
   * Get postal code placeholder for current country
   */
  getPostalCodePlaceholder(): string {
    return this.getCurrentCountryRules().postalCodePlaceholder;
  }

  /**
   * Validate postal code for current country
   */
  validatePostalCode(postalCode: string): boolean {
    return this.getPostalCodeRegex().test(postalCode);
  }

  // ==================== National ID Methods ====================

  /**
   * Get national ID regex pattern for current country
   */
  getNationalIdRegex(): RegExp | null {
    const regex = this.getCurrentCountryRules().nationalIdRegex;
    return regex ? new RegExp(regex) : null;
  }

  /**
   * Get national ID placeholder for current country
   */
  getNationalIdPlaceholder(): string {
    return this.getCurrentCountryRules().nationalIdPlaceholder || '';
  }

  /**
   * Validate national ID for current country
   */
  validateNationalId(nationalId: string): boolean {
    const regex = this.getNationalIdRegex();
    return regex ? regex.test(nationalId) : false;
  }

  // ==================== Tax ID Methods ====================

  /**
   * Get tax ID regex pattern for current country
   */
  getTaxIdRegex(): RegExp | null {
    const regex = this.getCurrentCountryRules().taxIdRegex;
    return regex ? new RegExp(regex) : null;
  }

  /**
   * Get tax ID placeholder for current country
   */
  getTaxIdPlaceholder(): string {
    return this.getCurrentCountryRules().taxIdPlaceholder || '';
  }

  /**
   * Validate tax ID for current country
   */
  validateTaxId(taxId: string): boolean {
    const regex = this.getTaxIdRegex();
    return regex ? regex.test(taxId) : false;
  }

  // ==================== Date Methods ====================

  /**
   * Get date format for current country
   */
  getDateFormat(): string {
    return this.getCurrentCountryRules().dateFormat;
  }

  /**
   * Get date placeholder for current country
   */
  getDatePlaceholder(): string {
    return this.getCurrentCountryRules().datePlaceholder;
  }

  /**
   * Get date regex pattern for current country
   */
  getDateRegex(): RegExp {
    return new RegExp(this.getCurrentCountryRules().dateRegex);
  }

  /**
   * Validate date string for current country
   */
  validateDate(date: string): boolean {
    return this.getDateRegex().test(date);
  }

  // ==================== Currency Methods ====================

  /**
   * Get currency code for current country
   */
  getCurrencyCode(): string {
    return this.getCurrentCountryRules().currencyCode;
  }

  /**
   * Get currency symbol for current country
   */
  getCurrencySymbol(): string {
    return this.getCurrentCountryRules().currencySymbol;
  }

  // ==================== Common Pattern Methods ====================

  /**
   * Get email regex pattern
   */
  getEmailRegex(): RegExp {
    return new RegExp(this.commonPatterns.email.regex);
  }

  /**
   * Get email placeholder
   */
  getEmailPlaceholder(): string {
    return this.commonPatterns.email.placeholder;
  }

  /**
   * Validate email
   */
  validateEmail(email: string): boolean {
    return this.getEmailRegex().test(email);
  }

  /**
   * Get URL regex pattern
   */
  getUrlRegex(): RegExp {
    return new RegExp(this.commonPatterns.url.regex);
  }

  /**
   * Validate URL
   */
  validateUrl(url: string): boolean {
    return this.getUrlRegex().test(url);
  }

  /**
   * Get username regex pattern
   */
  getUsernameRegex(): RegExp {
    return new RegExp(this.commonPatterns.username.regex);
  }

  /**
   * Validate username
   */
  validateUsername(username: string): boolean {
    return this.getUsernameRegex().test(username);
  }

  /**
   * Get password regex pattern
   */
  getPasswordRegex(): RegExp {
    return new RegExp(this.commonPatterns.password.regex);
  }

  /**
   * Validate password
   */
  validatePassword(password: string): boolean {
    return this.getPasswordRegex().test(password);
  }

  /**
   * Validate alphanumeric string
   */
  validateAlphanumeric(value: string): boolean {
    return new RegExp(this.commonPatterns.alphanumeric.regex).test(value);
  }

  /**
   * Validate alphabetic string
   */
  validateAlphabetic(value: string): boolean {
    return new RegExp(this.commonPatterns.alphabetic.regex).test(value);
  }

  /**
   * Validate numeric string
   */
  validateNumeric(value: string): boolean {
    return new RegExp(this.commonPatterns.numeric.regex).test(value);
  }

  /**
   * Validate decimal number
   */
  validateDecimal(value: string): boolean {
    return new RegExp(this.commonPatterns.decimal.regex).test(value);
  }

  /**
   * Format phone number with country code
   */
  formatPhoneNumber(phone: string): string {
    const phoneCode = this.getPhoneCode();
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If already has country code, return as is
    if (phone.startsWith(phoneCode)) {
      return phone;
    }
    
    // Add country code
    return `${phoneCode}${cleaned}`;
  }

  /**
   * Get error message for a validation type
   */
  getErrorMessage(validationType: keyof CommonValidationPatterns): string {
    return this.commonPatterns[validationType]?.errorMessage || 'Invalid input';
  }
}
