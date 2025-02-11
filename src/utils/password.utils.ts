// filepath: /Users/mac/Desktop/MyWorks/8thGear/geo-collect/src/utils/password.util.ts
export function generateStrongPassword(): string {
  const length = 8;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  let hasLower = false;
  let hasUpper = false;
  let hasNumber = false;
  let hasSpecial = false;

  while (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
    password = '';
    hasLower = false;
    hasUpper = false;
    hasNumber = false;
    hasSpecial = false;

    for (let i = 0, n = charset.length; i < length; ++i) {
      const char = charset.charAt(Math.floor(Math.random() * n));
      password += char;
      if (/[a-z]/.test(char)) hasLower = true;
      if (/[A-Z]/.test(char)) hasUpper = true;
      if (/[0-9]/.test(char)) hasNumber = true;
      if (/[^a-zA-Z0-9]/.test(char)) hasSpecial = true;
    }
  }

  return password;
}
