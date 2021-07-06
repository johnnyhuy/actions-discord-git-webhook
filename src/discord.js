const discord = require("discord.js");
const MAX_MESSAGE_LENGTH = 40;

module.exports.send = (id, token, repo, branch, url, commits, size, links) =>
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
      .send(createEmbed(repo, branch, url, commits, size, links))
      .then(() => {
        console.log("Successfully sent the message!");
        resolve();
      }, reject);
  });

function createEmbed(repo, branch, url, commits, size, links) {
  console.log("Constructing Embed...");
  let latest = commits[0];

  let embed = new discord.RichEmbed()
    .setURL(url)
    .setTitle("⚡ " +
      size +
        (size == 1 ? " Commit " : " Commits ") +
        "added to `" +
        repo +
        "` on 🌳" +
        branch +
    )
    .setDescription(getChangeLog(commits, size, links))
    .setTimestamp(Date.parse(latest.timestamp));

  if (!links) {
    embed.setURL(url)
  }

  return embed;
}

function getChangeLog(commits, size, links) {
  let changelog = "";

  for (let i in commits) {
    if (i > 3) {
      changelog += `+ ${size - i} more...\n`;
      break;
    }

    let commit = commits[i];
    let sha = commit.id.substring(0, 6);
    let message =
      commit.message.length > MAX_MESSAGE_LENGTH
        ? commit.message.substring(0, MAX_MESSAGE_LENGTH) + "..."
        : commit.message;
    changelog += links
      ? `[\`${sha}\`](${commit.url}) ${message} (@${commit.author.username})\n`
      : `\`${sha}\` ${message} (@${commit.author.username})\n`;
  }

  return changelog;
}
