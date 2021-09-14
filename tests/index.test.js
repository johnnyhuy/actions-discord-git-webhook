const core = require("@actions/core");
const discord = require("discord.js");
const github = require("@actions/github");
const webhooks = require("../src/discord");
const fs = require("fs");
const { run } = require("../src/run");
const { when } = require("jest-when");

jest.mock('../src/discord')
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

test("test", () => {
  github.context = {
    payload: require("./mocks/github_webhook_full.json"),
  };
  when(core.getInput).calledWith("webhook_url").mockReturnValue("yay!");
  return run().then(() => expect(webhooks.send).toHaveBeenCalledWith('test'));
});

test("send webhook", () => {
  return webhooks
    .send(123, 123, "test", "main", {}, [], "123", false, false, "blue")
    .then((data) => expect(data).toEqual({}));
});
