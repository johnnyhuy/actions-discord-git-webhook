test("get change log", async () => {
  const { getChangeLog } = require("../src/webhooks");
  const payload = require("./mocks/github_webhook_full.json");

  expect(getChangeLog(payload, false, false)).toMatchSnapshot();
});

test("get change log with censor username", async () => {
  const { getChangeLog } = require("../src/webhooks");
  const payload = require("./mocks/github_webhook_full.json");

  expect(getChangeLog(payload, false, true)).toMatchSnapshot();
});

test("get change log with hiding links", async () => {
  const { getChangeLog } = require("../src/webhooks");
  const payload = require("./mocks/github_webhook_full.json");

  expect(getChangeLog(payload, true, false)).toMatchSnapshot();
});

test("get change log with hiding links and censor username", async () => {
  const { getChangeLog } = require("../src/webhooks");
  const payload = require("./mocks/github_webhook_full.json");

  expect(getChangeLog(payload, true, true)).toMatchSnapshot();
});

test("send webhook", async () => {
  // Arrange
  const webhooks = require("../src/webhooks");
  const discord = require("discord.js");
  const sendWebhook = jest.fn(() => {
    return {
      send: jest.fn().mockResolvedValue(null),
    };
  });
  discord.WebhookClient = sendWebhook;
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
  const payload = require("./mocks/github_webhook_full.json");

  // Act
  const data = await webhooks.send(
    "https://discord.com/api/webhooks/123321123321/blah",
    payload,
    false,
    false,
    "blue",
  );

  // Assert
  expect(sendWebhook).toBeCalled();
});

test("send failed webhook", async () => {
  // Arrange
  const webhooks = require("../src/webhooks");
  const discord = require("discord.js");
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
  const payload = require("./mocks/github_webhook_full.json");

  try {
    // Act
    await webhooks.send(
      "https://discord.com/api/webhooks/913404819069345793/MF4mRyPECq9h4KI64B-UomFCcF1fZ1Ka_EnsQ89Hs0e0iaRc3migPGYdirz8odcpt2Wv",
      payload,
      false,
      false,
      "blue",
    );
  } catch (error) {
    // Assert
    expect(error).toStrictEqual(new Error());
  }
});
