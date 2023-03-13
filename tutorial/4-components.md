# Step 4: Adding and handling message components

In this step you'll:
- Update your code to send an interactive button
- Add code to handle interactions with the button

---

## Add button component

First, we'll add a button to the message your app sends. In Discord, buttons area type of [message component](https://discord.com/developers/docs/interactions/message-components#what-is-a-component) that your app can use to add interactivity to any of the messages it sends. Buttons have to be contained within a container called an [action row](https://discord.com/developers/docs/interactions/message-components#action-rows), which can hold up to 5 buttons or 1 select menu.

In `app.js` where your app sends the message, we'll add a new `components` array which holds all of the message components for that message. In the `components` array, we'll add an action row which will contain the button. Paste the following in the payload where the `embeds` array is also being sent:

```javascript
components: [
  {
    type: 1,
    components: [
      {
        type: 2,
        label: 'Reject Fate',
        style: 2,
        emoji: {
          id: null,
          name: '🔁',
        },
        custom_id: 'redo_button',
      },
    ],
  },
]
```

<details>
<summary>Full buildFortuneEmbed()</summary>

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
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: 'Reject Fate',
            style: 2,
            emoji: {
              id: null,
              name: '🔁',
            },
            custom_id: 'redo_button',
          },
        ],
      },
    ],
    attachments,
  };

  return JSON.stringify(payload);
}
```

</details>

A few things to call out in this new `components` payload:
- Similar to other `type` fields, we use integers to represent which component the payload is representing. All component types are in the [API documentation](https://discord.com/developers/docs/interactions/message-components#component-object-component-types). Buttons have a `type` of `2`, and action rows have a `type` of `1`.
- `style` determines the color of the button
- `custom_id` is an important field that acts as a unique identifier for the button. When we're setting up a handler for the button, we'll look for this specific `custom_id` value ("redo_button").

With your button added to the message payload, go ahead and try to send a slash command again and see your new button—ooooo aaaaaaa shiny ✨

If you click the button, you'll see it fails because we haven't set up any code to handle interactions with it for users.

## Handle button clicks

To handle button clicks, go to where we handled the command invocation in `app.js`. Under that, add the following which will let us handle message component interactions:

```javascript
if (type === InteractionType.MESSAGE_COMPONENT) {
  const { custom_id } = data;

  if (custom_id === 'redo_button') {
    // Handle button clicks
  }
}
```

You'll notice that we're accessing the `custom_id` for the message component. As noted before, this is how we'll identify interactions that are specific to that button.

In our button's `if` statement, we're going to paste the same logic from where we handled the command:

```javascript
if (type === InteractionType.MESSAGE_COMPONENT) {
  const { custom_id } = data;

  if (custom_id === 'redo_button') {
    await generateRandomFortune(id);
    // Acknowledge the message
    await res.send({
      type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    });

    // Use the unique ID as a temporary filename for the image we generate
    const fileName = `${id}-fortune.png`;
    // Get image that was generated
    const generatedFortune = await fs.createReadStream(`./${fileName}`);
    // Build the payload for the Discord message
    const embed = buildFortuneEmbed(member.user.id, fileName, null);

    // Create the FormData for Discord request
    // FormData because we're doing a file upload
    const payload = new FormData();
    // Add the embed JSON to the payload
    payload.append('payload_json', embed);
    // Add the image we generate to the payload
    payload.append('files[0]', generatedFortune, fileName);
    const headers = payload.getHeaders();

    // Use node-fetch to make requests
    await fetch(
      `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`,
      {
        headers: {
          ...headers,
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

Now if you click the button in Discord, your app should respond in the same way as the command.

### Next steps

Congrats, you should now have a basic app that responds to slash commands and message component interactions 🎉 To take your app to the next level, we've included some further resources in the `examples/` folder and [on the README](../README.md)

#### Table of contents

- [x] ~~[Step 0 - Project setup](0-remix.md)~~
- [x] ~~[Step 1 - Create app](1-create-app.md)~~
- [x] ~~[Step 2 - Setup credentials and interactivity](2-setup.md)~~
- [x] ~~[Step 3 - Register and handle slash command](3-command.md)~~
- [x] ~~[Step 4 - Add message components](4-components.md)~~