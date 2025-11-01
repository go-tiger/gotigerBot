import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MicrosoftModule } from './microsoft/microsoft.module';
import { RouterModule } from '@nestjs/core';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    RouterModule.register([
      {
        path: 'auth',
        children: [
          {
            path: '',
            module: MicrosoftModule,
          },
        ],
      },
    ]),
    MicrosoftModule,
  ],
})
export class AuthModule {}
