const core = require('@actions/core');
const github = require('@actions/github');

const webhook = require('../src/discord.js');

async function run() {
	const payload = github.context.payload;
	const repository = payload.repository.full_name;
	const commits = payload.commits;
	const size = commits.length;
	const branch = payload.ref.split('/')[payload.ref.split('/').length - 1];

	console.log(`Received payload ${JSON.stringify(payload, null, 2)}`);
	console.log(`Received ${commits.length}/${size} commits...`);

	if (commits.length === 0) {
        // This was likely a "--tags" push.
        console.log(`Aborting analysis, found no commits.`);
		return;
	}

	const webhookUrl = core.getInput("webhook_url");
	const links = core.getInput("links")

	if (webhookUrl !== '') {
		const url = webhookUrl.split('/');
		const id = url[5];
    	const token = url[6];
	} else {
		const id = core.getInput("id");
    	const token = core.getInput("token");
	}

	webhook.send(id, token, repository, branch, payload.compare, commits, size, report, links).catch(err => core.setFailed(err.message));
}

try {
	run();
} catch (error) {
    core.setFailed(error.message);
}

function isSkipped(commit) {
	return commit.message.toLowerCase().includes("[skip]");
}
