# Discord Webhook

> All credits go to the initial release by [baked-libs/discord-webhook](https://github.com/baked-libs/discord-webhook).

This is a fork of the original Discord Webhook GitHub Action, which was specifically catered towards Java development. This is one a slightly more generic one where we just want to post commits via webhooks.

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

## :framed_picture: Screenshots

The standard webhook from GitHub to Discord just dumps the commit messages right into your chat, this is fine but sometimes you just want some extra information. Did the commit introduce any new issues? Did it even compile successfully? That's what this Action is for.

### :spider_web: Standard Webhook

![old webhook](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/old-webhook.png)

### :star: New and improved Webhook

![tests passed](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/tests-passed.png)
![tests skipped](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/tests-skipped.png)
![tests failed](https://raw.githubusercontent.com/baked-libs/discord-webhook/master/assets/tests-failed.png)

### :books: Changes

* Removed the obnoxious author name and image at the top (may be a toggle in the future)
* The branch is now clearly visible "Slimefun4:master" -> "Slimefun4 (master)"
* The repository is now referred to by its full name, including the repository owner
* The embed now includes a timestamp (it is actually the timestamp of the commit, not just the current date of when the webhook was sent)
* Commit messages have slightly shorter limits and the committer is now better distinguishable from the commit message "Reduced technical debt - TheBusyBiscuit" -> "Reduced technical debt (@TheBusyBiscuit)"
* Includes test results, passes will be prepended with a green circle, skips with yellow and failures with red.
* It will also list the exact tests which failed (max of 4, then it will crop them)
* An estimated test coverage is provided if you use the `jacoco` maven plugin.
* Dynamic embed color changes

#### :art: Dynamic Coloring

The color of the embed changes depending on the compiler and test results. Here's a breakdown:

| Color  | Description                                                      |
| ------ | ---------------------------------------------------------------- |
| red    | The build has failed.                                            |
| orange | The build was successful but some tests failed.                  |
| yellow | The build was successful, no tests failed but some were skipped. |
| green  | The build was successful, no tests failed and none were skipped. |

## :scroll: Example setup

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
