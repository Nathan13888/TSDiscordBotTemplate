import {Logger} from './utils/logger';
import * as fetch from 'node-fetch';

export namespace Config {

  const ENV = process.env;

  // set prefix
  export let PREFIX: string;

  // CALL ONCE
  export function init(): void {
    // check token
    if (!Config.TOKEN) {
      throw new Error('Environment variable "DISCORD_TOKEN" is missing.');
    }
    const envPrefix = ENV.PREFIX; // prefix override
    if (envPrefix.length==2) {
      PREFIX = envPrefix;
    } else if (Config.isProd) {
      PREFIX = 'p:';
    } else {
      PREFIX = 'p!';
    }
    fetch(ENV.PERMIT, {method: 'Get'}).then((res: any) => res.json())
      .then((json: Permit) => {
        permit = json;
      });
  }

  export function disconnect(): void {
    // DB.disconnect();
  }

  export interface Permit {
    permitted: Array<string>,
  }

  // TODO: update defPermit
  const defPermit: Permit = {
    'permitted': [
      '259464008262746113',
      '269220748730695681',
    ],
  };
  let permit: Permit = undefined;

  export function getPermit(): Permit {
    if (permit == undefined) {
      const message = 'PERMIT IS MISSING!';
      Logger.log(message);
      // throw new Error(message);
      return defPermit;
    }
    return permit;
  }

  export const NODE_ENV: string = ENV.NODE_ENV;
  export const isProd: boolean = NODE_ENV==='production';
  export const TOKEN: string = ENV.DISCORD_TOKEN;
  export const BOTNAME: string = 'Polls Bot';
  export const COUNTERTOKEN: string = 'pollsbot';

  // VERSION
  const version = require('../package.json').version;
  export function getVersion(): string {
    return `${version} (${NODE_ENV})`;
  }
}
