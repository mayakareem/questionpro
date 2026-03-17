import { config } from '../config/settings.js';

/**
 * Input validation utilities
 */
export class Validator {
  /**
   * Validate user query
   */
  static validateQuery(query) {
    const errors = [];

    // Check if query exists
    if (!query || typeof query !== 'string') {
      errors.push('Query must be a non-empty string');
      return { valid: false, errors };
    }

    // Trim whitespace
    const trimmedQuery = query.trim();

    // Check minimum length
    if (trimmedQuery.length < config.validation.minQueryLength) {
      errors.push(
        `Query must be at least ${config.validation.minQueryLength} characters`
      );
    }

    // Check maximum length
    if (trimmedQuery.length > config.validation.maxQueryLength) {
      errors.push(
        `Query must not exceed ${config.validation.maxQueryLength} characters`
      );
    }

    // Check if query is just punctuation or special characters
    if (!/[a-zA-Z]/.test(trimmedQuery)) {
      errors.push('Query must contain at least some alphabetic characters');
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized: trimmedQuery,
    };
  }

  /**
   * Sanitize user input
   */
  static sanitize(input) {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .slice(0, config.validation.maxQueryLength); // Truncate if too long
  }
}

export default Validator;
