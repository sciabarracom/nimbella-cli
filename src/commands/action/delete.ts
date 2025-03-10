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
import RuntimeBaseCommand from '@adobe/aio-cli-plugin-runtime/src/RuntimeBaseCommand'
import { prompt } from '../../ui'
import { flags } from '@oclif/command'
const AioCommand: typeof RuntimeBaseCommand = require('@adobe/aio-cli-plugin-runtime/src/commands/runtime/action/delete')

export default class ActionDelete extends NimBaseCommand {
  async runCommand(rawArgv: string[], argv: string[], args: any, flags: any, logger: NimLogger): Promise<void> {
    if (inBrowser && flags.json) { // behave correctly when invoked from sidecar delete button
      if (!flags.force) {
        const ans = await prompt(`type 'yes' to really delete '${args.actionName}'`)
        if (ans !== 'yes') {
          logger.log('doing nothing')
          return
        }
      }
    }
    await this.runAio(rawArgv, argv, args, flags, logger, AioCommand)
  }

  static args = AioCommand.args

  static flags = {
    force: flags.boolean({ char: 'f', description: 'Just do it, omitting confirmatory prompt' }),
    ...AioCommand.flags
  }

  static description = AioCommand.description
}
