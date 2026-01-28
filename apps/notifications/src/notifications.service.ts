import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class NotificationsService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly logger: Logger, private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.configService.get('SMTP_USER'),
          clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
          clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
          refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
        },
      }
    );
  }


  async notifyEmail(notifyEmailDto: NotifyEmailDto) {
    this.logger.log(`Sending email to ${notifyEmailDto.email}`);
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: notifyEmailDto.email,
      subject: 'Notification',
      text: notifyEmailDto.text,
    });
  }
}
