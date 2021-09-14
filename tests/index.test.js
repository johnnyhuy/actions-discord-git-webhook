const core = require("@actions/core");
const discord = require("discord.js");
const github = require("@actions/github");
const webhooks = require("../src/discord");
const fs = require("fs");
const { run } = require("../src/run");
const { when } = require("jest-when");
const { ValidationException, getWebhook } = require("../src/validate.js");

jest.mock("../src/discord");
jest.mock("@actions/core");
jest.mock("discord.js", () => ({
  WebhookClient: jest.fn(),
  Client: jest.fn(),
  MessageEmbed: jest.fn(() => {
    return {
      setURL: jest.fn().mockReturnThis(),
      setColor: jest.fn().mockReturnThis(),
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setTimestamp: jest.fn().mockReturnThis(),
    };
  }),
}));

test("get webhook url", () => {
  const validWebhooks = [
    {
      url: "https://discord.com/api/webhooks/funkywebhookid/secretsaucewebhooktoken",
      id: "funkywebhookid",
      token: "secretsaucewebhooktoken",
    },
    {
      url: "discord.com/api/webhooks/funkywebhookid/secretsaucewebhooktoken",
      id: "funkywebhookid",
      token: "secretsaucewebhooktoken",
    },
  ];
  const invalidWebhooks = [
    "https://discord.com/api/webhooks/thisis-bad",
    "asdf",
  ];

  for (const webhook of invalidWebhooks) {
    expect(
      getWebhook(webhook.url)
    ).toThrow(ValidationException);
  }

  for (const webhook of validWebhooks) {
    expect(
      getWebhook(webhook.url)
    ).toBe({ id: webhook.id, token: webhook.token });
  }
});

test("send webhook", () => {
  // github.context = {
  //   payload: require("./mocks/github_webhook_full.json"),
  // };
  // return run().then(() => expect(webhooks.send).toHaveBeenCalledWith('test'));
  return webhooks
    .send(123, 123, "test", "main", {}, [], "123", false, false, "blue")
    .then((data) => expect(data).toEqual({}));
});
