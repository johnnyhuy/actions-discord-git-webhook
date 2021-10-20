exports.ValidationException = function ValidationException(message) {
  this.message = message;
}

exports.ValidationException.toString = function () {
  return `Validation error: "${this.message}"`;
}

exports.getWebhook = function getWebhook(url) {
  const regex = /^(?:http)?s?(?:\:\/\/)?discord\.com\/api\/webhooks\/[0-9]+\/[A-z0-9\-\_]+/i;

  if (!url.match(regex)) {
    throw new exports.ValidationException("Discord webhook URL is invalid");
  }

  const splitUrl = url.split(/\/([0-9]+)\/([A-z0-9\-\_]+)$/i);

  return [splitUrl[1], splitUrl[2]]
};
