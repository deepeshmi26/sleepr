import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDocument } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) { }

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));
    const token = await this.jwtService.signAsync(tokenPayload);
    response.cookie('Authentication', token, { httpOnly: true, expires });
    return token;
  }

  async verifyToken(token: string) {
    const decoded = await this.jwtService.verifyAsync(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }
    return decoded;
  }
}
