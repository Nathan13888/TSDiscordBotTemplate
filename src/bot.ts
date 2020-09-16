import * as Discord from 'discord.js';
import {Logger} from './utils/logger';
import {Config} from './config';
import {CommandService} from './services/command.service';
export namespace Bot {
  export let api: Discord.Client;

  // set name
  const NAME = (Config.isProd ? Config.BOTNAME:`${Config.BOTNAME} DEV`);

  export async function start() {
    api = new Discord.Client();
    const token: string = Config.TOKEN;

    Config.init();

    await api.login(token);

    api.on('ready', async () => {
      Logger.log(`${Config.BOTNAME} has started!`);
      Logger.log(`Connected as ${api.user.tag}`);
      Logger.log('Current version: ' + Config.getVersion());

      Logger.log('Setting up other config');

      await api.user.setUsername(NAME);
      await api.user.setAFK(false);
      await api.user.setActivity(
        `${Config.PREFIX}help | v${Config.getVersion()}`, {type: 'PLAYING'});
      await CommandService.registerCommands();
    });

    api.on('guildMemberAdd', (member) => {
      Logger.log(`${member.user.tag} has joined the server`);
    });
    api.on('guildMemberRemove', (member) => {
      Logger.log(`${member.user.tag} has left the server`);
    });
    api.on('disconnect', () => {
      Config.disconnect();
    });
  }
}

