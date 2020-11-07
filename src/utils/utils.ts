import {MessageAttachment, MessageEmbed, User} from 'discord.js';
import {Bot} from '../bot';
import {Logger} from './logger';
// import * as pack from '../../package.json';
export namespace Utils {
  export function delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
  export function getDefEmbed(): MessageEmbed {
    return new MessageEmbed().setColor('FFFFFF');
  }
  export function sendDM(msg: string | MessageEmbed |
    MessageAttachment, user: User): void {
    try {
      user.send(msg);
    } catch {
      Logger.log('An ERROR occured when trying to send a message to '+user.tag);
    }
  }
  export function getUptime(): string {
    let duration: number = Bot.api.uptime;
    const portions: string[] = [];
    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(hours + 'h');
      duration = duration - (hours * msInHour);
    }
    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(minutes + 'm');
      duration = duration - (minutes * msInMinute);
    }
    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
      portions.push(seconds + 's');
    }
    return portions.join(' ');
  }
}
