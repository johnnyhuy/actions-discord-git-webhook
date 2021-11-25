const { when } = require("jest-when");
const { ValidationException, getWebhook } = require("../src/validate.js");
const discord = require("discord.js");
const webhooks = require("../src/webhooks");

jest.mock("@actions/core");

afterEach(() => {
  jest.clearAllMocks();
})

test("get webhook url", () => {
  const validWebhooks = [
    {
      url: "https://discord.com/api/webhooks/123/secret_sauce-webhooktoken",
      id: "123",
      token: "secret_sauce-webhooktoken",
    },
    {
      url: "discord.com/api/webhooks/123/secret_sauce-webhooktoken",
      id: "123",
      token: "secret_sauce-webhooktoken",
    },
  ];
  const invalidWebhooks = [
    "https://discord.com/api/webhooks/thisis-bad",
    "asdf",
  ];

  for (const webhook of invalidWebhooks) {
    expect(() => getWebhook(webhook)).toThrow(ValidationException);
  }

  for (const webhook of validWebhooks) {
    const [id, token] = getWebhook(webhook.url);
    expect(id).toBe(webhook.id);
    expect(token).toBe(webhook.token);
  }
});

test("send webhook", async () => {
  // Arrange
  discord.WebhookClient = jest.fn(() => {
    return {
      send: jest.fn().mockResolvedValue(null),
    };
  });
  discord.Client = jest.fn()
  discord.MessageEmbed = jest.fn(() => {
    return {
      setURL: jest.fn().mockReturnThis(),
      setColor: jest.fn().mockReturnThis(),
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setTimestamp: jest.fn().mockReturnThis(),
    };
  })
  discord.WebhookClient.prototype.send = jest.fn(() => {
    return {
      send: jest.fn().mockRejectedValue(new Error()),
    };
  });
  const payload = require("./mocks/github_webhook_full.json");

  // Act
  const data = await webhooks.send("https://discord.com/api/webhooks/123321123321/blah", payload, false, false, "blue");

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
  discord.Client = jest.fn()
  discord.MessageEmbed = jest.fn(() => {
    return {
      setURL: jest.fn().mockReturnThis(),
      setColor: jest.fn().mockReturnThis(),
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setTimestamp: jest.fn().mockReturnThis(),
    };
  })
  discord.WebhookClient.prototype.send = jest.fn(() => {
    return {
      send: jest.fn().mockRejectedValue(new Error()),
    };
  });
  const payload = require("./mocks/github_webhook_full.json");

  try {
    // Act
    await webhooks.send("https://discord.com/api/webhooks/913404819069345793/MF4mRyPECq9h4KI64B-UomFCcF1fZ1Ka_EnsQ89Hs0e0iaRc3migPGYdirz8odcpt2Wv", payload, false, false, "blue");
  } catch (error) {
    // Assert
    expect(error).toStrictEqual(new Error());
  }
});
