// Validation rule constants
// Update these to match 3rd-party API server-side requirements

export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: true,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 255,
  },
  PASSWORD: {
    REQUIRED: true,
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: false, // Update based on API requirements
  },
  NAME: {
    REQUIRED: false,
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
};

export const ERROR_MESSAGES = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Invalid email format',
    MAX_LENGTH: `Email must not exceed ${VALIDATION_RULES.EMAIL.MAX_LENGTH} characters`,
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
    MAX_LENGTH: `Password must not exceed ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`,
    UPPERCASE: 'Password must contain at least one uppercase letter',
    LOWERCASE: 'Password must contain at least one lowercase letter',
    NUMBER: 'Password must contain at least one number',
    SPECIAL_CHAR: 'Password must contain at least one special character',
    MISMATCH: 'Passwords do not match',
  },
  GENERIC: {
    REQUIRED: 'This field is required',
    SERVER_ERROR: 'An error occurred. Please try again.',
  },
};
