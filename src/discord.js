const discord = require("discord.js");
const MAX_MESSAGE_LENGTH = 40;

module.exports.send = (id, token, repo, branch, url, commits, size, links, censorUsername) =>
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
      .send(createEmbed(repo, branch, url, commits, size, links, censorUsername))
      .then(() => {
        console.log("Successfully sent the message!");
        resolve();
      }, reject);
  });

function createEmbed(repo, branch, url, commits, size, links, censorUsername) {
  console.log("Constructing Embed...");
  let latest = commits[0];
  const count = size == 1 ? "Commit" : " Commits";

  let embed = new discord.RichEmbed()
    .setTitle(
      `⚡ ${size} ${count} - \`${repo}\` on 🌳 \`
        ${branch}\``
    )
    .setDescription(getChangeLog(commits, size, links, censorUsername))
    .setTimestamp(Date.parse(latest.timestamp));

  if (!links) {
    embed.setURL(url);
  }

  return embed;
}

function getChangeLog(commits, size, links, censorUsername) {
  let changelog = "";

  for (let i in commits) {
    if (i > 3) {
      changelog += `+ ${size - i} more...\n`;
      break;
    }

    const firstCharacter = commit.author.username[0]
    const lastCharacter = commit.author.username.length - 1
    const username = censorUsername ? `${firstCharacter}...${lastCharacter}` : commit.author.username

    let commit = commits[i];
    let sha = commit.id.substring(0, 6);
    let message =
      commit.message.length > MAX_MESSAGE_LENGTH
        ? commit.message.substring(0, MAX_MESSAGE_LENGTH) + "..."
        : commit.message;
    changelog += !links
      ? `\`${sha}\` ${message} (@${username})\n`
      : `[\`${sha}\`](${commit.url}) ${message} by @${username}\n`;
  }

  return changelog;
}
