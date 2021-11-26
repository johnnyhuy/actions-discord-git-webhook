const core = require("@actions/core");
const github = require("@actions/github");
const process = require("process");
const webhooks = require("./webhooks.js");

async function main() {
  let webhookUrl = core.getInput("webhook_url");
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

  if (!webhookUrl) {
    core.warning("Missing webhook URL, using id and token fields to generate a webhook URL")

    if (!id || !token) {
      core.setFailed("Webhook URL cannot be generated, please add `id` and `token` or `webhook_url` to the GitHub action")
      process.exit(1)
    }

    webhookUrl = `https://discord.com/api/webhooks/${id}/${token}`
  }

  await webhooks.send(
    webhookUrl,
    payload,
    hideLinks,
    censorUsername,
    color
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    core.setFailed(error)
    process.exit(1)
  });
