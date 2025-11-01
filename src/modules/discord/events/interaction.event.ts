import { Injectable, Logger } from '@nestjs/common';
import { Interaction } from 'discord.js';
import { VerifyCommandHandler } from '../commands/verify.handler';

@Injectable()
export class InteractionEvent {
  private readonly logger = new Logger(InteractionEvent.name);

  constructor(private readonly verifyHandler: VerifyCommandHandler) {}

  async handle(interaction: Interaction) {
    if (interaction.isChatInputCommand() && interaction.commandName === '인증') {
      await this.verifyHandler.execute(interaction);
      return;
    }

    if (interaction.isButton()) {
      const id = interaction.customId;

      if (id === 'verify_game_minecraft') {
        await interaction.reply('🔗 마인크래프트 계정 연동 링크를 생성 중입니다...');
      }

      if (id === 'verify_platform_chzzk') {
        await interaction.reply('🔗 치지직 계정 연동 링크를 생성 중입니다...');
      }
    }
  }
}
