import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as querystring from 'querystring';

@Injectable()
export class MicrosoftService {
  private clientId = process.env.MICROSOFT_CLIENT_ID!;
  private redirectUri = process.env.MICROSOFT_REDIRECT_URI!;

  generateAuthUrl(state: string) {
    const params = {
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: 'XboxLive.signin offline_access',
      state,
    };
    return 'https://login.live.com/oauth20_authorize.srf?' + querystring.stringify(params);
  }

  async handleCallback(code: string, state: string) {
    try {
      const tokenRes = await axios.post(
        'https://login.live.com/oauth20_token.srf',
        querystring.stringify({
          client_id: this.clientId,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      const msAccessToken = tokenRes.data.access_token;

      const xboxUserRes = await axios.post(
        'https://user.auth.xboxlive.com/user/authenticate',
        {
          Properties: {
            AuthMethod: 'RPS',
            SiteName: 'user.auth.xboxlive.com',
            RpsTicket: `d=${msAccessToken}`,
          },
          RelyingParty: 'http://auth.xboxlive.com',
          TokenType: 'JWT',
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
      const userToken = xboxUserRes.data.Token;

      const xstsRes = await axios.post(
        'https://xsts.auth.xboxlive.com/xsts/authorize',
        {
          Properties: {
            SandboxId: 'RETAIL',
            UserTokens: [userToken],
          },
          RelyingParty: 'rp://api.minecraftservices.com/',
          TokenType: 'JWT',
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const xstsToken = xstsRes.data.Token;
      const uhs = xstsRes.data.DisplayClaims.xui[0].uhs;

      const identityToken = `XBL3.0 x=${uhs};${xstsToken}`;

      const mcLogin = await axios.post(
        'https://api.minecraftservices.com/authentication/login_with_xbox',
        { identityToken },
        { headers: { 'Content-Type': 'application/json' } },
      );
      const mcAccessToken = mcLogin.data.access_token;

      const profile = await axios.get('https://api.minecraftservices.com/minecraft/profile', {
        headers: { Authorization: `Bearer ${mcAccessToken}` },
      });

      return {
        discordId: state,
        profile: profile.data,
      };
    } catch (err: any) {
      console.error('❌ handleCallback 에러:', err.response?.data || err.message);
      throw err;
    }
  }
}
