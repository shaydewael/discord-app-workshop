import 'dotenv/config';
import express from 'express';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { VerifyDiscordRequest, DiscordRequest } from './utils/requests.js';
import { GenerateImage } from './utils/images.js';
import { GetRandom } from './utils/helpers.js';
import fs from 'fs';
import FormData from 'form-data';

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
  
  const currentUnixTime = Math.floor(Date.now() / 1000);

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
    

    if (name === 'fortune') {
      const randomImg = GetRandom(images);
      const randomFortune = GetRandom(fortunes);
      const userId = member.user ? member.user.id : 'Someone';

      // Acknowledge the message
      await res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      });

      if (token) {
        const fileName = `${id}-fortune.png`;
        const header = data.options
          ? `<t:${currentUnixTime}:R> <@${userId}> asked "${data.options[0]['value']}"`
          : `<@${userId}>'s fortune awaits...`;
        await GenerateImage(randomImg, randomFortune, `${id}-fortune.png`);
        const generatedFortune = await fs.createReadStream(`./${fileName}`);
        const f = new FormData();
        const payload = await buildEmbed(userId, fileName, header);
  
        f.append(
          'payload_json',
          payload
        );
        f.append('files[0]', generatedFortune, fileName);

        const h = f.getHeaders();

        // Use node-fetch to make requests
        await fetch(
          `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`,
          {
            headers: {
              Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
              ...h,
            },
            method: 'PATCH',
            body: f,
          }
        );

        fs.unlinkSync(`./${fileName}`);
      }
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    const randomImg = GetRandom(images);
    const randomFortune = GetRandom(fortunes);
    const userId = member.user ? member.user.id : 'Someone';

    await res.send({
      type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    });

    // TODO: isolate this logicccc so it's just Discord-specific stuff
    if (token) {
      const fileName = `${id}-fortune.png`;
      const header = data.options
        ? `<t:${currentUnixTime}:R> <@${userId}> asked "${data.options[0]['value']}"`
        : `<@${userId}>'s fortune awaits...`;
      await GenerateImage(randomImg, randomFortune, `${id}-fortune.png`);
      const generatedFortune = await fs.createReadStream(`./${fileName}`);
      const f = new FormData();
      const payload = await buildEmbed(userId, fileName, header);

      f.append(
        'payload_json',
        payload
      );
      f.append('files[0]', generatedFortune, fileName);
      const h = f.getHeaders();

      

      // Use node-fetch to make requests
      await fetch(
        `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            ...h,
          },
          method: 'PATCH',
          body: f,
        }
      );

      fs.unlinkSync(`./${fileName}`);
    }
  }
});

async function buildEmbed(userId, fileName, header) {
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
            custom_id: 'my_button',
          },
        ],
      },
    ],
    attachments,
  };

  return JSON.stringify(payload);
}

const images = [
  'assets/pinkblurple.png',
  'assets/yellowpink.png',
  'assets/tangerine.png',
  'assets/cyberpunk.png',
  'assets/greenyellow.png',
];
const fortunes = [
  'YESSSSSSSSSSSS',
  '100%',
  'literally yea',
  'no doubt',
  'oh for sure for sure',
  'you got this',
  "it's a slay",
  'the answer you seek is found within',
  'the answer is clear as mud',
  'hmmmm...maybe try a tarot reading instead?',
  "we've been over this",
  '...literally no',
  'lol no',
  'ngl not looking great...',
  'like keep asking but the answer is still no',
  'really? ask me later...',
  'you ate on that one...',
];

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
