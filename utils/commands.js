import { DiscordRequest } from './requests.js';

/**
 * Install a command scoped to a single server
 */
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Install a command across all servers
 */
export async function InstallGlobalCommands(appId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest(endpoint, { method: 'PUT', body: command });
  } catch (err) {
    console.error(err);
  }
}

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

export const ALL_COMMANDS = [FORTUNE_COMMAND];