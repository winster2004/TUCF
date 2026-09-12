import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SubscriptionGuard } from '../common/guard/subscription.guard';

@Controller('dashboard')
export class DashboardController {
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  @Get()
  getDashboard(@Req() req: any) {
    const user = req.user;

    // dummy data (later connect DB)
    return {
      message: 'Dashboard data fetched successfully',
      data: {
        userName: user.name,
        jobsApplied: 12,
        atsScore: 78,
        portfolioViews: 45,
        roadmapProgress: 60,
      },
    };
  }
}
