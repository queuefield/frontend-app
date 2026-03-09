export interface CountryValidationRules {
  countryCode: string;
  countryName: string;
  phoneCode: string;
  
  // Phone validation
  phoneRegex: string;
  phonePlaceholder: string;
  phoneFormat: string;
  phoneMinLength: number;
  phoneMaxLength: number;
  
  // Postal/ZIP code validation
  postalCodeRegex: string;
  postalCodePlaceholder: string;
  postalCodeFormat: string;
  
  // National ID validation
  nationalIdRegex?: string;
  nationalIdPlaceholder?: string;
  nationalIdFormat?: string;
  
  // Tax ID validation
  taxIdRegex?: string;
  taxIdPlaceholder?: string;
  taxIdFormat?: string;
  
  // Date format
  dateFormat: string;
  dateRegex: string;
  datePlaceholder: string;
  
  // Currency
  currencyCode: string;
  currencySymbol: string;
}

export interface CommonValidationPatterns {
  email: {
    regex: string;
    placeholder: string;
    errorMessage: string;
  };
  url: {
    regex: string;
    placeholder: string;
    errorMessage: string;
  };
  username: {
    regex: string;
    placeholder: string;
    minLength: number;
    maxLength: number;
    errorMessage: string;
  };
  password: {
    regex: string;
    placeholder: string;
    minLength: number;
    maxLength: number;
    errorMessage: string;
  };
  alphanumeric: {
    regex: string;
    errorMessage: string;
  };
  alphabetic: {
    regex: string;
    errorMessage: string;
  };
  numeric: {
    regex: string;
    errorMessage: string;
  };
  decimal: {
    regex: string;
    errorMessage: string;
  };
}
