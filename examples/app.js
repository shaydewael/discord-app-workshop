import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import FormData from 'form-data';

import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { VerifyDiscordRequest } from './utils/requests.js';
import { GenerateImage } from './utils/images.js';
import { GetRandomImage, GetRandomFortune } from './utils/fortune.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data, token, member } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
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
      // FormData is not required for simple messages, but we're using because we're doing a file upload
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

  /**
   * Handle message component requests
   * See https://discord.com/developers/docs/interactions/receiving-and-responding
   */
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
});

/**
 * Function to interface with fortune.js and generate the fortune for a request
 * @param id - the interaction ID which will be used to create unique filename
 */
async function generateRandomFortune(id) {
  const randomImg = GetRandomImage();
  const randomFortune = GetRandomFortune();
  await GenerateImage(randomImg, randomFortune, `${id}-fortune.png`);

  return;
}

/**
 * Function to create payload for the embed to send back to Discord\
 * @param userId   Discord user ID
 * @param fileName File name of the image included in the embed
 * @param header   Text to include at the top of the embed
 */
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

/**
 * Start express server so we can receive requests from Discord
 */
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
