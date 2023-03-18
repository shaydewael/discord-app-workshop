# Step 3: Register and handle slash command

In this step you'll:
- Install a slash command for your app
- Write handler code for your slash command

---

## Register a command

First, we're going to register a global slash command, which is installed on all servers where your app is installed (for now, that's just your test server). Commands are registered by calling the [Create Global Application Command endpoint](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command) with a valid command payload.

### Command payload

If you look in your project's `commands.js` file, you'll see a payload for a `/fortune` command:

```javascript
const FORTUNE_COMMAND = {
  type: 1,
  name: 'fortune',
  description: 'Ask a question to have your fortune read',
  options: [
    {
      type: 3,
      name: 'question',
      description: 'The question you want answered',
      required: false,
      min_length: 1
    }
  ]
};
```

Let's break that down a little...

- **`type`** is a number that determines which kind of command it is. Remember that in addition to slash commands (`type` of `1`), there are [user commands](https://discord.com/developers/docs/interactions/application-commands#user-commands) (`type` of `2`) and [message commands](https://discord.com/developers/docs/interactions/application-commands#message-commands) (`type` of `3`).
- **`name`** is the name that users will invoke your command with. Through just the name alone, it should be pretty clear what the purpose of the command is.
- **`description`** is additional information that describes what your command does, and what the user should expect as a result of running the command.
- **`options`** is a list of optional [slash command options](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type). You don't need this to create a command, but we are including a string option (`type` of `3` for the slash command option) to allow the user to input a question for the `/fortune` command.
  
### Code for registering a command

There are a few pieces of code that go into registering a command in our project. 

Take a look at `utils/register.js`. This is a file dedicated to registering commands for our project. If you run this file, it'll actually use those payload(s) in `commands.js` to create global application commands for your app.
- The `InstallGlobalCommands()` function is a helper function to call `PUT /applications/<application_id>/commands` (which allows you to create multiple commands at once). One thing to note is you'll see a call to `DiscordRequest()` in this function, which is just a helper function in `utils/requests.js` to make HTTP requests to Discord.
- You also can see a call to `InstallGlobalCommands()` with `ALL_COMMANDS` (which just our command payload(s) imported from the `commands.js` file). 

> 🧰 Helper functions like `DiscordRequest()` are there to make it a bit easier to start making API calls. If you use a [developer library](https://discord.com/developers/docs/topics/community-resources#libraries) in the future, it'll likely handle a lot of the complexities and offer similar utility functions for you.

### Run the register command

After you've edited your command payload(s) in `commands.js` to your liking, open **💻 Terminal** at the bottom of your Glitch project. Copy and paste the following, which will run `utils/register.js`:

```
npm run register
```

Then hit enter.

Navigate to your test Discord server where you installed your app and you should see your newly-installed command. You can try and run the command, but you'll see that your app has an error since we haven't set up any code to handle slash command invocations in our app.

## Handle the command

Go to your project's `app.js` file and look for the following lines:

```javascript
if (type === InteractionType.APPLICATION_COMMAND) {
  // Handle slash commands
  console.log(req.body);
}
```

This is a block of code that is run for interaction payloads that are sent to your app by Discord when a user invokes a command. Right now, it's just printing the request body (which you can see in the logs if you try to run the command).

Let's add a line to actually *respond* to the interaction. There are [a few ways we could respond to the interaction](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type), but for now let's just reply with a simple message. Paste the following within the `if` statement from above:

```javascript
const { name } = data;

// Name of the application command
if (name === 'fortune') {
  // Gets random fortune from function in utils/fortune.js
  const randomFortune = GetRandomFortune();
  res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: randomFortune
    }
  });
}
```

This is now only responding to commands that have the name "fortune". If you run your command, your app shouldn't error and will instead respond with a random fortune 🎊😎🌎

## Respond with an embed

While we could stop there and just respond with simple text, we can take it to the next level and respond with an embed that contains a more engaging image. Before we change the code from above, let's create an embed payload. In `app.js`, you'll see the following near the bottom:

```javascript
function buildFortuneEmbed(userId, fileName, userInput) {
  // TODO: create embed payload
}
```

Replace that function with the following:

```javascript
function buildFortuneEmbed(userId, fileName, userInput) {
  // Get current time to include
  const currentUnixTime = Math.floor(Date.now() / 1000);
  // Text that will appear above the image in the message embed
  const embedDescription = userInput
    ? `<t:${currentUnixTime}:R> <@${userId}> asked "${userInput}"`
    : `<@${userId}>'s fortune awaits...`;

  const attachments = [
    {
      id: 0,
      description: `Fortune for <@${userId}>`,
      filename: fileName,
    },
  ];
  const payload = {
    embeds: [
      {
        description: embedDescription,
        image: { url: `attachment://${fileName}` },
        color: 8226557,
      },
    ]
  };

  // the payload needs to be stringified before we send it to Discord
  return JSON.stringify(payload);
}
```

One thing to note is that there are two ways you can add an image to an embed: a public URL or an attachment. Since we're generating the image ourselves, we're uploading it as an [attatchment](https://discord.com/developers/docs/reference#uploading-files). 

<details>
<summary>Using a public image instead of an attachment</summary>

If we instead used a public URL, the code for our embed could be simplified quite a bit. For example:

```javascript
function buildFortuneEmbed(userId, fileName, userInput) {
  // Get current time to include
  const currentUnixTime = Math.floor(Date.now() / 1000);
  // Text that will appear above the image in the message embed
  const embedDescription = userInput
    ? `<t:${currentUnixTime}:R> <@${userId}> asked "${userInput}"`
    : `<@${userId}>'s fortune awaits...`;

  const payload = {
    embeds: [
      {
        description: embedDescription,
        image: { url: 'https://urltoyour.com/image.png' },
        color: 8226557,
      },
    ]
  };

  return JSON.stringify(payload);
}
```
</details>

Back up where you handle your command, paste the following (it's a lot but we'll go over it in a second):

> 💡 You can also find this code in the completed file (`examples/app.js`)

```javascript
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // Name of the application command
        if (name === 'fortune') {
      // Fetch the question the user asked (if it exists)
      const userInput = data.options ? data.options[0]['value'] : null;
      // Create the fortune image that we'll send to the user
      await generateRandomFortune(id);

      // See all interaction callback types https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
      // Acknowledge the message
      await res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      });

      // Use the unique ID as a temporary filename for the image we generate
      const fileName = `${id}-fortune.png`;
      // Get image that was generated
      const generatedFortune = await fs.createReadStream(`./${fileName}`);
      // Build the payload for the Discord message
      const embed = buildFortuneEmbed(member.user.id, fileName, userInput);

      // Create the FormData for Discord request
      // FormData because we're doing a file upload
      const payload = new FormData();
      // Add the embed JSON to the payload
      payload.append('payload_json', embed);
      // Add the image we generate to the payload
      payload.append('files[0]', generatedFortune, fileName);

      // Use node-fetch to make requests
      await fetch(
        `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`,
        {
          headers: {
            ...payload.getHeaders(),
          },
          method: 'PATCH',
          body: payload,
        }
      );

      // Delete the file we generated
      fs.unlinkSync(`./${fileName}`);
      return;
    }
  }
```

The first thing to call out is you'll see we're not just responding with a message anymore. We've updated our response to the following:

```javascript
await res.send({
  type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
});
```

Since apps only have 3 seconds to respond to interactive requests and we may need a little more time to generate and upload an image, we're using `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE` to acknowledge that we received the event and are working on generating a response. 

Later, we'll use the interaction token to populate the deferred message:

```javascript
await fetch(
    `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`,
    {
      headers: {
        ...payload.getHeaders(),
      },
      method: 'PATCH',
      body: payload,
    }
  );
```

<details>
<summary>Why are we using formdata?</summary>

In the code above you'll see:

```javascript
const payload = new FormData();
```

We're using formdata instead of just a regular JSON response because we're uploading a file via an attachment. More information about this is in the documentation under [Uploading Files](https://discord.com/developers/docs/reference#uploading-files).
</details>

The last thing to call out is how we're parsing the command option:

```javascript
const userInput = data.options ? data.options[0]['value'] : null;
```

If a user filled out our optional command option, it'll appear in the request payload's `options` object. The above line checks if `options` exist, and if it does, fetches the value in it.

### Next steps

Now that we're handling and responding to the slash command, let's finish up by adding even more interactivity by adding message components.

#### Table of contents

- [x] ~~[Step 0 - Project setup](0-remix.md)~~
- [x] ~~[Step 1 - Create app](1-create-app.md)~~
- [x] ~~[Step 2 - Setup credentials and interactivity](2-setup.md)~~
- [x] ~~[Step 3 - Register and handle slash command](3-command.md)~~
- [ ] 👉 **Next: [Step 4 - Add message components](4-components.md)**
