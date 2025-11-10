// Form validation utilities
// Client-side validation must match server-side requirements

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * TODO: Update these rules to match 3rd-party API requirements
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate passwords match
 */
export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate login form
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateRequired(email, 'Email');
  if (emailError) {
    errors.email = emailError;
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }

  const passwordError = validateRequired(password, 'Password');
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate registration form
 * TODO: Update to match 3rd-party API requirements
 */
export function validateRegisterForm(
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateRequired(email, 'Email');
  if (emailError) {
    errors.email = emailError;
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }

  const passwordError = validateRequired(password, 'Password');
  if (passwordError) {
    errors.password = passwordError;
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors.join(', ');
    }
  }

  if (!validatePasswordMatch(password, confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate change password form
 * TODO: Update to match server-side requirements
 */
export function validateChangePasswordForm(
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): ValidationResult {
  const errors: Record<string, string> = {};

  const currentPasswordError = validateRequired(currentPassword, 'Current password');
  if (currentPasswordError) {
    errors.currentPassword = currentPasswordError;
  }

  const newPasswordError = validateRequired(newPassword, 'New password');
  if (newPasswordError) {
    errors.newPassword = newPasswordError;
  } else {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      errors.newPassword = passwordValidation.errors.join(', ');
    }
  }

  if (currentPassword === newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }

  if (!validatePasswordMatch(newPassword, confirmNewPassword)) {
    errors.confirmNewPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
