import { ValidationErrorDetail } from './auth.validator';

export const validateCreateTaskInput = (data: any): { isValid: boolean; errors: ValidationErrorDetail } => {
  const errors: ValidationErrorDetail = {};
  const { title, description } = data;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.title = 'Task title is required';
  } else if (title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.description = 'Description must be a string';
    } else if (description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateTaskInput = (data: any): { isValid: boolean; errors: ValidationErrorDetail } => {
  const errors: ValidationErrorDetail = {};
  const { title, description, completed } = data;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.title = 'Task title cannot be empty';
    } else if (title.trim().length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.description = 'Description must be a string';
    } else if (description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.completed = 'Completed status must be a boolean value';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};