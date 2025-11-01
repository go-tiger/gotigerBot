import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

@Injectable()
export class VerifyCommandHandler {
  async execute(interaction: ChatInputCommandInteraction) {
    const category = interaction.options.getString('카테고리');

    if (category === 'game') {
      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle('🎮 게임 인증')
        .setDescription('연동할 게임을 선택하세요.')
        .addFields({
          name: '🧩 마인크래프트',
          value: '마인크래프트 계정을 연동합니다.',
          inline: false,
        });

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('verify_game_minecraft').setLabel('마인크래프트').setStyle(ButtonStyle.Success),
      );

      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
    } else if (category === 'platform') {
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle('📺 플랫폼 인증')
        .setDescription('연동할 플랫폼을 선택하세요.')
        .addFields({
          name: '💚 치지직',
          value: '치지직 계정을 연동합니다.',
          inline: false,
        });

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('verify_platform_chzzk').setLabel('치지직').setStyle(ButtonStyle.Primary),
      );

      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
    } else {
      await interaction.reply({
        content: '❓ 올바른 카테고리를 선택하세요. (게임 / 플랫폼)',
        ephemeral: true,
      });
    }
  }
}
