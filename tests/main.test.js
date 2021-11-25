const { when } = require("jest-when");
const core = require("@actions/core");
const github = require("@actions/github");
const process = require("process");
const discord = require("discord.js");
const webhooks = require("../src/webhooks");

jest.mock("@actions/core");
jest.mock("@actions/github");
jest.spyOn(process, 'exit').mockImplementation(() => {});

afterEach(() => {
  jest.clearAllMocks();
});

// test("get changelog censored")

test("error if webhook URL, token and ID is empty", async () => {
  // Arrange
  const payload = require("./mocks/github_webhook_full.json");
  github.context.payload = payload
  webhooks.send = jest.fn();

  // Act
  const data = await require("../src/app")

  // Assert
  expect(data).toEqual({});
  expect(core.setFailed).toHaveBeenCalledWith("Webhook URL cannot be generated, please use ID and tokens or webhook_url fields");
})

test("error if token is empty", async () => {
  // Arrange
  const payload = require("./mocks/github_webhook_full.json");
  github.context.payload = payload
  webhooks.send = jest.fn();
  when(core.getInput).calledWith("id").mockReturnValue('123321123321')

  // Act
  const data = await require("../src/app")

  // Assert
  expect(data).toEqual({});
  expect(core.setFailed).toHaveBeenCalledWith("Webhook URL cannot be generated, please use ID and tokens or webhook_url fields");
})

test("error if id is empty", async () => {
  // Arrange
  const payload = require("./mocks/github_webhook_full.json");
  github.context.payload = payload
  webhooks.send = jest.fn();
  when(core.getInput).calledWith("token").mockReturnValue('123321123321')

  // Act
  const data = await require("../src/app")

  // Assert
  expect(data).toEqual({});
  expect(core.setFailed).toHaveBeenCalledWith("Webhook URL cannot be generated, please use ID and tokens or webhook_url fields");
})

test("error if webhook url is empty", async () => {
  // Arrange
  const payload = require("./mocks/github_webhook_full.json");
  github.context.payload = payload
  webhooks.send = jest.fn();
  when(core.getInput).calledWith("id").mockReturnValue('123321123321')
  when(core.getInput).calledWith("token").mockReturnValue('123321123321')

  // Act
  const data = await require("../src/app")

  // Assert
  expect(data).toEqual({});
  expect(core.setFailed).not.toHaveBeenCalledWith("Webhook URL cannot be generated, please use ID and tokens or webhook_url fields");
})

test("send webhook", async () => {
  // Arrange
  discord.WebhookClient = jest.fn(() => {
    return {
      send: jest.fn().mockResolvedValue(null),
    };
  });
  discord.Client = jest.fn();
  discord.MessageEmbed = jest.fn(() => {
    return {
      setURL: jest.fn().mockReturnThis(),
      setColor: jest.fn().mockReturnThis(),
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setTimestamp: jest.fn().mockReturnThis(),
    };
  });
  discord.WebhookClient.prototype.send = jest.fn(() => {
    return {
      send: jest.fn().mockRejectedValue(new Error()),
    };
  });
  const payload = require("./mocks/github_webhook_full.json");

  // Act
  const data = await webhooks.send(
    "https://discord.com/api/webhooks/123321123321/blah",
    payload,
    false,
    false,
    "blue"
  );

  // Assert
  expect(data).toBeNull();
});

test("send failed webhook", async () => {
  // Arrange
  discord.WebhookClient = jest.fn(() => {
    return {
      send: jest.fn().mockRejectedValue(new Error()),
    };
  });
  discord.Client = jest.fn();
  discord.MessageEmbed = jest.fn(() => {
    return {
      setURL: jest.fn().mockReturnThis(),
      setColor: jest.fn().mockReturnThis(),
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setTimestamp: jest.fn().mockReturnThis(),
    };
  });
  discord.WebhookClient.prototype.send = jest.fn(() => {
    return {
      send: jest.fn().mockRejectedValue(new Error()),
    };
  });
  const payload = require("./mocks/github_webhook_full.json");

  try {
    // Act
    await webhooks.send(
      "https://discord.com/api/webhooks/913404819069345793/MF4mRyPECq9h4KI64B-UomFCcF1fZ1Ka_EnsQ89Hs0e0iaRc3migPGYdirz8odcpt2Wv",
      payload,
      false,
      false,
      "blue"
    );
  } catch (error) {
    // Assert
    expect(error).toStrictEqual(new Error());
  }
});
