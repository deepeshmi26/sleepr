import { CreateChargeDto, NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService, @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy, private readonly logger: Logger) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!)
  }

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        payment_method: "pm_card_visa",
        confirm: true,
        payment_method_types: ['card'],
      })

      this.notificationsService.emit('notify-email', {
        email: email,
        text: `Your payment of $${amount * 100} has been successful`,
      });

      return paymentIntent;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
