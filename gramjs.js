const telegram = require('telegram')
const sessions = require('telegram/sessions')
const StringSession = sessions.StringSession
const TelegramClient = telegram.TelegramClient
const input = require('input')

//1BQANOTEuMTA4LjU2LjEyOAG7Y3U4lTyjdDYrWwVPGPZWNw1kNeCPUpxjjx9E9SBGEZVyr1kgFQZM9aHe40JQLw+7ITTLnSyk9SUzYk+Yglp/2eZDK1TjmPmF+799xeI5DxynCeOPobqMp+QsJq3VdxrS4cycrUDZ13U4WjNxUGaETfu8P7zLuPjMy2/sDY8ZQn7kPyrtQj7eEpxpJTgzslpGJr5k6Vkx9mnAOh7+tpWzIXjXJizP3M2HfoGuuTXWJtJ/MvnM8KehjYm3cDg6T0dYZlxB+6JaS3b2DCsLR2dUoxKW/7/1epjUpPXmda6Y0yY/uHZjxP2TAbeGkW29MArSv+nOLVOnmK4zecGohjxWyQ==

const apiId = 14878688;
const apiHash = "7e9e17c602314d95ec633b04e9ac58c0";
const stringSession = new StringSession(""); // fill this later with the value from session.save()

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again
  await client.sendMessage("me", { message: "Hello!" });
})();