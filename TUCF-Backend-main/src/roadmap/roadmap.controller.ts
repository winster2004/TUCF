import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SubscriptionGuard } from '../common/guard/subscription.guard';

@Controller('roadmap')
export class RoadmapController {
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  @Post('generate')
  generate() {
    return {
      message: 'Roadmap generated successfully',
    };
  }
}
