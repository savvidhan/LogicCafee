/**
 * Custom API Error class
 * Used to throw controlled errors with status codes
 */

class ApiError extends Error {
  
  constructor(statusCode, message) {
    super(message);

    // Set status code and success flag
    this.statusCode = statusCode;
    this.success = false;

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
