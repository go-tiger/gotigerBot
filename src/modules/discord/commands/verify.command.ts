import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { ConfigService } from '@nestjs/config';

export async function registerVerifyCommand(config: ConfigService) {
  const clientId = config.get<string>('DISCORD_CLIENT_ID')!;
  const guildId = config.get<string>('DISCORD_GUILD_ID')!;
  const token = config.get<string>('DISCORD_TOKEN')!;

  const rest = new REST({ version: '10' }).setToken(token);

  const command = new SlashCommandBuilder()
    .setName('인증')
    .setDescription('계정 인증을 진행합니다.')
    .addStringOption((option) =>
      option
        .setName('카테고리')
        .setDescription('게임 또는 플랫폼 중 하나를 선택하세요.')
        .setRequired(true)
        .addChoices({ name: '게임', value: 'game' }, { name: '플랫폼', value: 'platform' }),
    );

  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: [command.toJSON()],
    });
    console.log('✅ [Discord] /인증 명령어 등록 완료');
  } catch (error) {
    console.error('❌ [Discord] 명령어 등록 실패:', error);
  }
}
