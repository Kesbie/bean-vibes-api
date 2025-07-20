const { status } = require('http-status');

class ApiSuccess {
  constructor({ code = status.OK, data, message = 'success' }) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  send(res, headers = {}) {
    return res.status(this.code).json(this);
  }
}

class OK extends ApiSuccess {
  constructor(data) {
    super({ code: status.OK, data });
  }
}

class CREATED extends ApiSuccess {
  constructor(data) {
    super({ code: status.CREATED, data });
  }
}

class NO_CONTENT extends ApiSuccess {
  constructor() {
    super({ code: status.NO_CONTENT, data: {} });
  }
}

module.exports = {
  OK,
  CREATED,
  NO_CONTENT,
};
