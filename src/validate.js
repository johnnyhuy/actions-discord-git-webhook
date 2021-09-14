exports.ValidationException = function ValidationException(message) {
  this.message = message;
}

exports.ValidationException.toString = function () {
  return `Validation error: "${this.message}"`;
}

exports.getWebhook = function getWebhook(url) {
  return "test";
};
