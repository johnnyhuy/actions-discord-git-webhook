const discord = require("discord.js");
const MAX_MESSAGE_LENGTH = 128;

module.exports.send = (
  webhookUrl,
  payload,
  hideLinks,
  censorUsername,
  color
) => {
  const repository = payload.repository.full_name;
  const commits = payload.commits;
  const size = commits.length;
  const branch = payload.ref.split("/")[payload.ref.split("/").length - 1];
  const url = payload.compare;

  if (commits.length === 0) {
    console.log(`Aborting analysis, found no commits.`);
    return Promise.resolve();
  }

  console.log(`Received payload: ${JSON.stringify(payload, null, 2)}`);
  console.log(`Received ${commits.length}/${size} commits...`);
  console.log("Constructing Embed...");

  let latest = commits[0];
  const count = size == 1 ? "Commit" : " Commits";

  let embed = new discord.MessageEmbed()
    .setColor(color)
    .setTitle(`⚡ ${size} ${count} - \`${repository}\` on 🌳 \`${branch}\``)
    .setDescription(this.getChangeLog(payload, hideLinks, censorUsername))
    .setTimestamp(Date.parse(latest.timestamp));

  if (!hideLinks) {
    embed.setURL(url);
  }

  return new Promise((resolve, reject) => {
    let client;
    console.log("Preparing Discord webhook client...");
    try {
      client = new discord.WebhookClient({ url: webhookUrl });
    } catch (error) {
      reject(error);
    }

    console.log("Sending webhook message...");
    
    return client
      .send({
        embeds: [embed]
      })
      .then((result) => {
        console.log("Successfully sent the message!");
        resolve(result);
      })
      .catch((error) => reject(error));
  });
};

module.exports.getChangeLog = (payload, hideLinks, censorUsername) => {
  console.log("Constructing Changelog...");
  const commits = payload.commits;
  let changelog = "";

  for (let i in commits) {
    if (i > 3) {
      changelog += `+ ${commits.length - i} more...\n`;
      break;
    }

    let commit = commits[i];
    const firstCharacter = commit.author.username[0];
    const lastCharacter =
      commit.author.username[commit.author.username.length - 1];
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
};
