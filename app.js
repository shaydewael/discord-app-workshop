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
    console.log(data);
    // Handle your command here
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
function buildFortuneEmbed(userId, fileName, header) {
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
        description: header,
        image: { url: `attachment://${fileName}` },
        color: 8226557,
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
