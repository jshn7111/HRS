export function required(value) {
  return value ? undefined : 'This field is required.';
}

export function email(value) {
  return /\S+@\S+\.\S+/.test(value) ? undefined : 'Enter a valid email address.';
}
