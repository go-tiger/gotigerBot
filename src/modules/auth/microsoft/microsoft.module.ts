import { Module } from '@nestjs/common';
import { MicrosoftService } from './microsoft.service';
import { MicrosoftController } from './microsoft.controller';

@Module({
  controllers: [MicrosoftController],
  providers: [MicrosoftService],
})
export class MicrosoftModule {}
