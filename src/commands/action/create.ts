/*
 * Copyright (c) 2019 - present Nimbella Corp.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { NimBaseCommand, NimLogger, inBrowser } from '@nimbella/nimbella-deployer'

import { flags } from '@oclif/command'
import RuntimeBaseCommand from '@adobe/aio-cli-plugin-runtime/src/RuntimeBaseCommand'
const AioCommand: typeof RuntimeBaseCommand = require('@adobe/aio-cli-plugin-runtime/src/commands/runtime/action/create')

export default class ActionCreate extends NimBaseCommand {
  async runCommand(rawArgv: string[], argv: string[], args: any, flags: any, logger: NimLogger): Promise<void> {
    screenLegal(!!args.actionPath, flags, logger)
    await this.runAio(rawArgv, argv, args, flags, logger, AioCommand)
  }

  static args = AioCommand.args

  // Change description from what is in aio: log size limit is KB, not MB, and defaults should not be specified statically
  static flags = Object.assign({}, AioCommand.flags, {
    timeout: flags.integer({
      char: 't',
      description: 'Timeout LIMIT in milliseconds after which the Action is terminated'
    }),
    memory: flags.integer({
      char: 'm',
      description: 'Maximum memory LIMIT in MB for the Action'
    }),
    logsize: flags.integer({
      char: 'l',
      description: 'Maximum log size LIMIT in KB for the Action'
    })
  })

  static description = AioCommand.description
}

// Screen legality when running in the cloud
export function screenLegal(hasActionPath: boolean, flags: any, logger: NimLogger): void {
  if (inBrowser && (hasActionPath || flags['annotation-file'] || flags['env-file'] || flags['param-file'])) {
    logger.handleError('command contains file system references and cannot run in the cloud')
  }
}
