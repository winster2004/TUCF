import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SubscriptionService } from './subscription.service';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('upgrade')
  upgradeSubscription(@Req() req: any, @Body() body: UpgradeSubscriptionDto) {
    const userId = req.user.id;
    return this.subscriptionService.upgradeSubscription(userId, body.plan);
  }

  @Post('upgrade/starter')
  upgradeToStarter(@Req() req: any) {
    const userId = req.user.id;
    return this.subscriptionService.upgradeToStarter(userId);
  }

  @Post('upgrade/pro')
  upgradeToPro(@Req() req: any) {
    const userId = req.user.id;
    return this.subscriptionService.upgradeToPro(userId);
  }

  @Get('status')
  getSubscriptionStatus(@Req() req: any) {
    const userId = req.user.id;
    return this.subscriptionService.getSubscriptionStatus(userId);
  }
}
