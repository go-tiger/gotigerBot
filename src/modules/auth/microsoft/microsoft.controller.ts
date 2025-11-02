import { Controller, Get, Query, Res } from '@nestjs/common';
import { MicrosoftService } from './microsoft.service';
import type { Response } from 'express';

@Controller('microsoft')
export class MicrosoftController {
  constructor(private readonly microsoftService: MicrosoftService) {}

  @Get('login')
  login(@Query('state') state: string, @Res() res: Response) {
    const url = this.microsoftService.generateAuthUrl(state);
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      const result = await this.microsoftService.handleCallback(code, state);
      const nickname = result.profile.name;
      return res.redirect(`/auth-success.html?nickname=${encodeURIComponent(nickname)}`);
    } catch (e) {
      return res.status(500).send('인증 중 오류가 발생했습니다.');
    }
  }
}
