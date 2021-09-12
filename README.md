# Discord Webhook

> All credits go to the initial release by [baked-libs/discord-webhook](https://github.com/baked-libs/discord-webhook).

This is a hard fork of the original Discord Webhook GitHub Action, which was specifically catered towards Java development. This is one a slightly more generic one where we just want to post commits via webhooks.

## :mailbox_with_no_mail: Inputs

### `webhook_url`

**Required** The GitHub webhook URL comprised of both `id` and `token` fields.

### `id`

**Required** This is the id of your Discord webhook, if you copy the webhook url, this will be the first part of it. This is ignored if `webhook_url` is set.

### `token`

**Required** Now your Discord webhook token, it's the second part of the url. This is ignored if `webhook_url` is set.

### `censor_username`

Censor username with by only showing the first and last character. For example, `j...y` as `johnnyhuy`.

### `repo_name`

Specify a custom repository name to overwrite the `username/repo` format.

### `hide_links`

Hide links on embedded view.

### `color`

Color of the Discord embed.

## :framed_picture: Screenshots

The standard webhook from GitHub to Discord just dumps the commit messages right into your chat, this is fine but sometimes you just want some extra information. Did the commit introduce any new issues? Did it even compile successfully? That's what this Action is for.

### :spider_web: Standard Webhook

![old webhook](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/old-webhook.png)

### :star: New and improved Webhook

![tests passed](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/tests-passed.png)
![tests skipped](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/tests-skipped.png)
![tests failed](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/tests-failed.png)

## :scroll: Usage

To set up this Action, create a new workflow file under `.github/workflows/workflow_name.yml`.

```yaml
name: Discord Webhook

on: [push]

jobs:
  git:
    runs-on: ubuntu-latest
    steps:

    - uses: actions/checkout@v2

    - name: Run Discord Webhook
      uses: johnnyhuy/discord-webhook@main
      with:
        webhook_url: ${{ secrets.YOUR_DISCORD_WEBHOOK_URL }}

    # Disable URL links to the repository
    # 
    # - name: Run Discord Webhook
    #   uses: johnnyhuy/discord-webhook@main
    #   with:
    #     webhook_url: ${{ secrets.YOUR_DISCORD_WEBHOOK_URL }}
    #     hide_links: true

    # Censor username
    # 
    # - name: Run Discord Webhook
    #   uses: johnnyhuy/discord-webhook@main
    #   with:
    #     webhook_url: ${{ secrets.YOUR_DISCORD_WEBHOOK_URL }}
    #     censor_username: false

    # Using an ID and token
    # 
    # - name: Run Discord Webhook
    #   uses: johnnyhuy/discord-webhook@main
    #   with:
    #     id: ${{ secrets.YOUR_DISCORD_WEBHOOK_ID }}
    #     token: ${{ secrets.YOUR_DISCORD_WEBHOOK_TOKEN }}

    # Using a custom repo name
    # 
    # - name: Run Discord Webhook
    #   uses: johnnyhuy/discord-webhook@main
    #   with:
    #     id: ${{ secrets.YOUR_DISCORD_WEBHOOK_ID }}
    #     token: ${{ secrets.YOUR_DISCORD_WEBHOOK_TOKEN }}
    #     repo_name: My Special Repo
```

## Versioning changes

Changes are versioned via GitHub Actions that use [`standard-version`](https://github.com/conventional-changelog/standard-version) to create Git tags and [`conventional-github-releaser`](https://github.com/conventional-changelog/releaser-tools/tree/master/packages/conventional-github-releaser) to submit GitHub releases.

We follow the [`Conventional Commits`](https://www.conventionalcommits.org/en/v1.0.0/#summary) standard where commit messages get *automatically* analysed to produce a generated semantic version.

## Development

NodeJS should be the only hard requirement to get this project working to make changes. Optionally, we can use Docker Compose to provide this dependency in container with a volume to our host to make additional code changes.

```bash
# Local
npm ci

# Docker
docker-compose build workspace
docker-compose run --rm workspace
npm ci
```
