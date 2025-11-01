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
        const discordId = interaction.user.id;
        const baseUrl = process.env.API_BASE_URL;
        const authUrl = `${baseUrl}/auth/microsoft/login?state=${discordId}`;

        await interaction.reply({
          content: `🔗 [마이크로소프트 계정 인증하기](${authUrl})`,
          ephemeral: true,
        });
      }

      if (id === 'verify_platform_chzzk') {
        await interaction.reply('🔗 치지직 계정 연동 링크를 생성 중입니다...');
      }
    }
  }
}
