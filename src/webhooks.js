const discord = require("discord.js");
const core = require("@actions/core");
const MAX_MESSAGE_LENGTH = 128;

module.exports.send = (
  webhookUrl,
  payload,
  hideLinks,
  censorUsername,
  color,
  threadId
) => {
  const repository = payload.repository.full_name;
  const commits = payload.commits;
  const size = commits.length;
  const branch = payload.ref.split("/")[payload.ref.split("/").length - 1];
  const url = payload.compare;

  if (commits.length === 0) {
    core.warning(`Aborting analysis, found no commits.`);
    return Promise.resolve();
  }

  core.debug(`Received payload: ${JSON.stringify(payload, null, 2)}`);
  core.debug(`Received ${commits.length}/${size} commits...`);
  core.info("Constructing Embed...");

  let latest = commits[0];
  const count = size == 1 ? "Commit" : " Commits";

  let embed = new discord.MessageEmbed()
    .setColor(color)
    .setTitle(`⚡ ${size} ${count}\n📁\`${repository}\`\n🌳 \`${branch}\``)
    .setDescription(this.getChangeLog(payload, hideLinks, censorUsername))
    .setTimestamp(Date.parse(latest.timestamp));

  if (!hideLinks) {
    embed.setURL(url);
  }

  return new Promise((resolve, reject) => {
    let client;
    core.info("Preparing Discord webhook client...");

    try {
      client = new discord.WebhookClient({ url: webhookUrl });
    } catch (error) {
      reject(error);
    }

    if (threadId) {
      core.info(`Sending message to thread: ${threadId}`);
    } else {
      core.info("Sending message to channel...");
    }

    return client
      .send({
        embeds: [embed],
        threadId: threadId || null,
      })
      .then((result) => {
        core.info("Successfully sent the message!");
        resolve(result);
      })
      .catch((error) => reject(error));
  });
};

module.exports.getChangeLog = (payload, hideLinks, censorUsername) => {
  core.info("Constructing Changelog...");
  const commits = payload.commits;
  let changelog = "";

  for (let i in commits) {
    if (i > 3) {
      changelog += `+ ${commits.length - i} more...\n`;
      break;
    }

    let commit = commits[i];
    const firstUsername = commit.author.username[0];
    const lastUsername =
      commit.author.username[commit.author.username.length - 1];
    const username = !!censorUsername
      ? `${firstUsername}...${lastUsername}`
      : commit.author.username;
    const repository = payload.repository;

    if (commit.message.includes(repository.full_name) && hideLinks) {
      const firstRepository = repository.full_name[0];
      const lastRepository =
        repository.full_name[repository.full_name.length - 1];
      commit.message = commit.message.replaceAll(
        repository.full_name,
        `${firstRepository}...${lastRepository}`
      );
    }

    let sha = commit.id.substring(0, 6);
    let message =
      commit.message.length > MAX_MESSAGE_LENGTH
        ? commit.message.substring(0, MAX_MESSAGE_LENGTH) + "..."
        : commit.message;
    changelog += !hideLinks
      ? `[\`${sha}\`](${commit.url}) ${message} by _@${username}_\n`
      : `\`${sha}\` ${message}  by _@${username}_\n`;
  }

  return changelog;
};
