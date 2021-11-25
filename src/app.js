const core = require("@actions/core");
const github = require("@actions/github");
const process = require("process");
const webhook = require("./webhooks.js");
const validate = require("./validate.js");

function main() {
  const webhookUrl = core.getInput("webhook_url");
  const hideLinks = core.getInput("hide_links");
  const color = core.getInput("color");
  const id = core.getInput("id");
  const token = core.getInput("token");
  const customRepoName = core.getInput("repo_name");
  const censorUsername = core.getInput("censor_username");

  let payload = github.context.payload;

  if (customRepoName !== "") {
    payload.repository.full_name = customRepoName;
  }

  if (webhookUrl) {
    [id, token] = validate.getWebhook(webhookUrl)
  }

  await webhook.send(
    id,
    token,
    payload,
    hideLinks,
    censorUsername,
    color
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => core.setFailed(error.message));
