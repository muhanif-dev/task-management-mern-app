export interface ValidationErrorDetail {
  [key: string]: string;
}

export const validateSignupInput = (data: any): { isValid: boolean; errors: ValidationErrorDetail } => {
  const errors: ValidationErrorDetail = {};
  const { name, email, password, confirmPassword } = data;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Invalid email address';
    }
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSigninInput = (data: any): { isValid: boolean; errors: ValidationErrorDetail } => {
  const errors: ValidationErrorDetail = {};
  const { email, password } = data;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.email = 'Email is required';
  }

  if (!password || typeof password !== 'string' || password === '') {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};