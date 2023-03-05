import 'dotenv/config';
import { InstallGlobalCommands, ALL_COMMANDS } from './commands.js';

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);