const discord = require("discord.js");
const MAX_MESSAGE_LENGTH = 64;

module.exports.send = (
  id,
  token,
  repo,
  branch,
  url,
  commits,
  size,
  hideLinks,
  censorUsername
) =>
  new Promise((resolve, reject) => {
    let client;
    console.log("Preparing Webhook...");
    try {
      client = new discord.WebhookClient(id, token);
    } catch (error) {
      reject(error.message);
      return;
    }

    client
      .send(
        createEmbed(repo, branch, url, commits, size, hideLinks, censorUsername)
      )
      .then(() => {
        console.log("Successfully sent the message!");
        resolve();
      }, reject);
  });

function createEmbed(
  repo,
  branch,
  url,
  commits,
  size,
  hideLinks,
  censorUsername
) {
  console.log("Constructing Embed...");
  let latest = commits[0];
  const count = size == 1 ? "Commit" : " Commits";

  let embed = new discord.RichEmbed()
    .setColor('7dbbe6')
    .setTitle(
      `⚡ ${size} ${count} - \`${repo}\` on 🌳 \`${branch}\``
    )
    .setDescription(getChangeLog(commits, size, hideLinks, censorUsername))
    .setTimestamp(Date.parse(latest.timestamp));

  if (!hideLinks) {
    embed.setURL(url);
  }

  return embed;
}

function getChangeLog(commits, size, hideLinks, censorUsername) {
  console.log("Constructing Changelog...");
  let changelog = "";

  for (let i in commits) {
    if (i > 3) {
      changelog += `+ ${size - i} more...\n`;
      break;
    }

    let commit = commits[i];
    const firstCharacter = commit.author.username[0];
    const lastCharacter = commit.author.username[commit.author.username.length - 1];
    const username = censorUsername
      ? `${firstCharacter}...${lastCharacter}`
      : commit.author.username;

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
}
