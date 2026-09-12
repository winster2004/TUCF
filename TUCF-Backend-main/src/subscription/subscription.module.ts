import { Module } from '@nestjs/common';
import { SubscriptionController } from '../subscription/subscription.controller';
import { SubscriptionService } from '../subscription/subscription.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
