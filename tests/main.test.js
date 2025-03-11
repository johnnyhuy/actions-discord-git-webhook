const { when, resetAllWhenMocks } = require("jest-when");
const process = require("process");

jest.mock("discord.js");
jest.mock("@actions/core");
jest.mock("@actions/github");
jest.spyOn(process, "exit").mockImplementation(() => Promise.resolve);

afterEach(() => {
  jest.resetModules();
});

test("error if webhook URL, token and ID is empty", async () => {
  // Arrange
  const payload = require("./mocks/github_webhook_full.json");
  const core = require("@actions/core");
  const github = require("@actions/github");
  const webhooks = require("../src/webhooks");
  webhooks.send = jest.fn();
  github.context.payload = payload;

  // Act
  expect.assertions(1);
  const data = await require("../src/app");

  // Assert
  expect(core.setFailed).toHaveBeenCalledWith(
    "Webhook URL cannot be generated, please add `id` and `token` or `webhook_url` to the GitHub action",
  );
});

test("error if token is empty", async () => {
  // Arrange
  const payload = require("./mocks/github_webhook_full.json");
  const core = require("@actions/core");
  const github = require("@actions/github");
  const webhooks = require("../src/webhooks");
  webhooks.send = jest.fn();
  github.context.payload = payload;
  when(core.getInput).calledWith("id").mockReturnValue("123321123321");

  // Act
  expect.assertions(1);
  const data = await require("../src/app");

  // Assert
  expect(core.setFailed).toHaveBeenCalledWith(
    "Webhook URL cannot be generated, please add `id` and `token` or `webhook_url` to the GitHub action",
  );
});

test("error if id is empty", async () => {
  // Arrange
  const payload = require("./mocks/github_webhook_full.json");
  const core = require("@actions/core");
  const github = require("@actions/github");
  const webhooks = require("../src/webhooks");
  webhooks.send = jest.fn();
  github.context.payload = payload;
  when(core.getInput).calledWith("token").mockReturnValue("123321123321");

  // Act
  expect.assertions(1);
  const data = await require("../src/app");

  // Assert
  expect(core.setFailed).toHaveBeenCalledWith(
    "Webhook URL cannot be generated, please add `id` and `token` or `webhook_url` to the GitHub action",
  );
});

test("error if webhook url is empty", async () => {
  // Arrange
  const payload = require("./mocks/github_webhook_full.json");
  const core = require("@actions/core");
  const github = require("@actions/github");
  const webhooks = require("../src/webhooks");
  webhooks.send = jest.fn();
  github.context.payload = payload;
  when(core.getInput).calledWith("id").mockReturnValue("123321123321");
  when(core.getInput).calledWith("token").mockReturnValue("123321123321");

  // Act
  expect.assertions(1);
  const data = await require("../src/app");

  // Assert
  expect(core.setFailed).not.toHaveBeenCalledWith(
    "Webhook URL cannot be generated, please add `id` and `token` or `webhook_url` to the GitHub action",
  );
});
