// backend/utils/passwordValidator.js
const passwordValidator = {
  // Expanded list of common weak passwords to reject
  commonPasswords: [
    'password', 'password123', '123456', '12345678', '123456789', '1234567890',
    'qwerty', 'abc123', 'letmein', 'monkey', 'football', 'baseball',
    'iloveyou', 'admin', 'welcome', 'sunshine', 'master', 'superman',
    'hello', 'charlie', 'aa123456', 'donald', 'trustno1', 'mustang',
    'ninja', 'michael', 'jordan', 'shadow', 'ashley', 'bailey',
    'passw0rd', 'access', 'jennifer', 'hunter', 'freedom', 'princess',
    'solo', 'dragon', 'starwars', 'matrix', 'george', 'thomas'
  ],

  // Validate password complexity
  validatePassword(password) {
    const errors = [];

    // Check minimum length
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    // Check for uppercase letters
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter (A-Z).");
    }

    // Check for lowercase letters
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter (a-z).");
    }

    // Check for numbers
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number (0-9).");
    }

    // Check for special characters
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&* etc.).");
    }

    // Check for common passwords (case-insensitive)
    const lowerPassword = password.toLowerCase();
    if (this.commonPasswords.includes(lowerPassword)) {
      errors.push("Password is too common. Please choose a more unique password.");
    }

    // Check for repeated characters (e.g., "aaaaaa")
    if (/(.)\1{3,}/.test(password)) {
      errors.push("Password contains too many repeated characters.");
    }

    // Check for sequential characters (e.g., "12345", "abcd")
    if (/(123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      errors.push("Password contains sequential characters that are easy to guess.");
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  // Get password strength score (optional, for future use)
  getStrengthScore(password) {
    let score = 0;
    
    // Length score
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety score
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    
    return {
      score: score,
      maxScore: 7,
      strength: score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong'
    };
  }
};

module.exports = passwordValidator;