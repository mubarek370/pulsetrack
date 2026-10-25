const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const NAME_RE = /^[\p{L}][\p{L}\p{M}' .-]*$/u

const COMMON_PASSWORDS = ['password', 'password1', 'password123', '12345678', 'qwerty123', 'iloveyou1']

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
]

export function validateName(value = '') {
  const v = value.trim()
  if (!v) return 'Enter your name.'
  if (v.length < 2) return 'Name must be at least 2 characters.'
  if (v.length > 50) return 'Name must be 50 characters or fewer.'
  if (!NAME_RE.test(v)) return 'Use letters, spaces, hyphens, and apostrophes only.'
  return ''
}

export function validateEmail(value = '') {
  const v = value.trim()
  if (!v) return 'Enter your email address.'
  if (v.length > 254) return 'Email address is too long.'
  if (!EMAIL_RE.test(v)) return 'Enter a valid email, like name@example.com.'
  return ''
}

export function validatePassword(value = '') {
  if (!value) return 'Enter a password.'
  if (value.length > 64) return 'Password must be 64 characters or fewer.'
  if (PASSWORD_RULES.some((rule) => !rule.test(value))) return 'Password must meet all the requirements below.'
  if (COMMON_PASSWORDS.includes(value.toLowerCase())) return 'This password is too common. Choose another.'
  return ''
}

export function validateConfirm(value = '', password = '') {
  if (!value) return 'Confirm your password.'
  if (value !== password) return 'Passwords do not match.'
  return ''
}

/** Returns { score: 0-4, label } for the strength meter. */
export function getPasswordStrength(password = '') {
  if (!password) return { score: 0, label: '' }
  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length
  const strong = password.length >= 12 || /[^A-Za-z0-9]/.test(password)
  let score = 1
  if (passed >= 2 && passed < 4) score = 2
  if (passed === 4) score = strong ? 4 : 3
  return { score, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][score] }
}

/* Validator maps: each is (value, allValues) => error message or ''. Defined once so they stay stable. */

export const loginValidators = {
  email: validateEmail,
  password: (value) => (value ? '' : 'Enter your password.'),
}

export const signupValidators = {
  name: validateName,
  email: validateEmail,
  password: validatePassword,
  confirmPassword: (value, values) => validateConfirm(value, values.password),
}

export const profileValidators = {
  name: validateName,
  email: validateEmail,
}
