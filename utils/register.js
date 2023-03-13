import 'dotenv/config';
import { DiscordRequest } from './requests.js';
import { ALL_COMMANDS } from '../commands.js';

/**
 * Install a command across all servers
 * @param appId   ID of app
 * @param command Command JSON payload
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

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
