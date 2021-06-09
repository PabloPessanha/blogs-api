class CustomError extends Error {
  constructor({ message, status }) {
    super(message);

    this.status = status;
  }
}

function throwError(message, status) {
  throw new CustomError({ message, status });
}

module.exports = throwError;
