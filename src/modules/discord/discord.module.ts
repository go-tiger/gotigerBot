import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordService } from './discord.service';
import { InteractionEvent } from './events/interaction.event';
import { VerifyCommandHandler } from './commands/verify.handler';

@Module({
  imports: [ConfigModule],
  providers: [DiscordService, InteractionEvent, VerifyCommandHandler],
  exports: [DiscordService],
})
export class DiscordModule {}
