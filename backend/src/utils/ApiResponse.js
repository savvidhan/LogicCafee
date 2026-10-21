/**
 * Standard API Response class
 * Ensures consistent success responses
 */
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
