const { status } = require('http-status');

// class ApiError extends Error {
//   constructor(statusCode, message, isOperational = true, stack = '') {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

class ApiError extends Error {
  constructor({ statusCode = status.INTERNAL_SERVER_ERROR, message = 'error', stack = '' }) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.stack = stack;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class NOT_FOUND extends ApiError {
  constructor(message) {
    super({ statusCode: status.NOT_FOUND, message });
  }
}

class UNAUTHORIZED extends ApiError {
  constructor(message) {
    super({ statusCode: status.UNAUTHORIZED, message });
  }
}


class FORBIDDEN extends ApiError {
  constructor(message) {
    super({ statusCode: status.FORBIDDEN, message });
  }
}

class BAD_REQUEST extends ApiError {
  constructor(message) {
    super({ statusCode: status.BAD_REQUEST, message });
  }
}

module.exports = {
  ApiError,
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST,
  NOT_FOUND,
};  
