export const validateRegister = (data) => {
  const errors = [];
  if (!data.name) errors.push('Name is required');
  if (!data.email) errors.push('Email is required');
  if (!data.password) errors.push('Password is required');
  return errors;
};

export const validateLogin = (data) => {
  const errors = [];
  if (!data.email) errors.push('Email is required');
  if (!data.password) errors.push('Password is required');
  return errors;
};
