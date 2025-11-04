import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthService {
  constructor(private configService: ConfigService) {}

  async verifyGoogleToken(accessToken: string) {
    try {
      
      const clientId = this.configService.get('google.clientId');
      
    
      const tokenInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
      );

      if (!tokenInfoResponse.ok) {
        throw new BadRequestException('Invalid Google token');
      }

      const tokenInfo = await tokenInfoResponse.json();

   
      if (tokenInfo.aud !== clientId) {
        throw new BadRequestException('Token audience mismatch');
      }

    
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new BadRequestException('Failed to get user info from Google');
      }

      const userInfo = await userInfoResponse.json();

      return {
        googleId: userInfo.sub,
        email: userInfo.email,
        userName: userInfo.name || userInfo.email.split('@')[0],
        avatar: userInfo.picture,
        isEmailVerified: userInfo.email_verified,
      };
    } catch (error) {
      console.error('Google token verification error:', error);
      throw new BadRequestException('Invalid Google token');
    }
  }
}