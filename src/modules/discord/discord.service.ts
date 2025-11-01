import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { InteractionEvent } from './events/interaction.event';
import { registerVerifyCommand } from './commands/verify.command';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly interactionEvent: InteractionEvent,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Channel],
    });
  }

  async onModuleInit() {
    const token = this.configService.get<string>('DISCORD_TOKEN');
    if (!token) {
      this.logger.error('❌ DISCORD_TOKEN이 설정되어 있지 않습니다.');
      return;
    }

    this.registerEvents();

    try {
      await this.client.login(token);
      this.logger.log('✅ Discord 봇이 로그인되었습니다.');
    } catch (error) {
      this.logger.error('❌ Discord 로그인 실패:', error);
    }
  }

  private registerEvents() {
    this.client.once('clientReady', async () => {
      this.logger.log(`🤖 로그인 성공: ${this.client.user?.tag}`);
      await registerVerifyCommand(this.configService);
    });

    this.client.on('interactionCreate', async (interaction) => {
      await this.interactionEvent.handle(interaction);
    });
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.warn(`🛑 애플리케이션 종료 감지 (${signal ?? 'manual'})`);
    if (this.client) {
      await this.client.destroy();
      this.logger.log('👋 Discord 봇 연결 종료');
    }
  }
}
