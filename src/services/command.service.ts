import {Bot} from '../bot';
import {Logger} from '../utils/logger';
import {Command} from '../commands/command';
import {Uptime} from '../commands/uptime';
import {Version} from '../commands/version';
import {Message} from 'discord.js';
import {Config} from '../config';
import {Counter} from './counter.service';
export namespace CommandService {
  export function hasPermit(id: string): boolean {
    const permit: Config.Permit = Config.getPermit();
    return permit.permitted.includes(id);
  }

  export const commands: Array<Command> = [];

  // export const commandChannels: string[]
  //   = [Config.Channels.defCommandChannel];
  export async function registerCommands() {
    // TODO: add command cooldown
    Bot.api.on('message', async (msg) => {
      if (msg.author.bot) return; // bots
      // if (!Config.isProd && !hasPermit(msg.author.id)) return; // dev bot
      /* if (!msg.guild || !(msg.channel instanceof TextChannel)) {
        msg.reply('Commands are only allowed in server Text Channels');
      } else */if (msg.content.substring(0, 2) === Config.PREFIX) {
        // if (msg.guild.id===Config.GUILD) {
        // if (commandChannels.includes(msg.channel.id) ||
        //   hasPermit(msg.author.id)) {
        parseCommand(msg);
        // } else {
        //   // TODO: fix this weird thing
        //   msg.react('❌');
        //   const s = 'WCCB commands are only allowed at ' +
        //   'the relevant bot commands channels. ' +
        //   'Please contact <@!259464008262746113> ' +
        //   'if you believe this is an error.';
        //   msg.reply(Utils.getDefEmbed()
        //     .setTitle('Allowed Command Channels.')
        //     .setDescription(s))
        //     .then((msg)=>{
        //       msg.delete({timeout: 5000});
        //     });
        // }
        // }
      }
    });

    // COMMANDS
    // commands.push(new ());
    commands.push(new Version());
    commands.push(new Uptime());
  }

  export function findCommand(cmd: string): Command {
    // TODO: command mapping using HashMap, etc
    // TODO: macro alias detection (all-caps)
    for (const com of commands) {
      if (com.getAliases().includes(cmd)) {
        return com;
      }
    }
    return undefined;
  }

  // TODO: Use reply to make more clear replies to incorrect command usages
  async function parseCommand(msg: Message) {
    Logger.log(
      `${msg.author.tag} executed \`${msg.content}\``);
    Counter.addProcessed();
    // TODO: Improve regex to support single and double quotes.
    const args = msg.content.slice(2).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const com = findCommand(cmd);
    if (com) {
      if (com.needsPermit() && !hasPermit(msg.author.id)) {
        Logger.log('Permission denied from ID: ' + msg.author.id);
      } else {
        const res: boolean = await com.exec(msg, args);
        if (!res) {
        // incorrect usage
          msg.react('❌');
          msg.reply('**Incorrect command usage**');
        }
        return;
      }
    }
    msg.react('❌');
    msg.reply('**Command NOT found**');
  }
}
