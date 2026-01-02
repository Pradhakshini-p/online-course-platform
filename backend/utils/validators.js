// backend/utils/validators.js

// Input validation helpers

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

export const validateObjectId = (id) => {
  const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  return ObjectIdRegex.test(id);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};

