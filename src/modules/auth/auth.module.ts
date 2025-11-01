import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MicrosoftModule } from './microsoft/microsoft.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [MicrosoftModule],
})
export class AuthModule {}
