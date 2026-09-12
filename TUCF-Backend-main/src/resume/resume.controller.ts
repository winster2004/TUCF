import {
  Controller,
  Post,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('resume')
export class ResumeController {
  @UseGuards(JwtAuthGuard)
  @Post('export')
  exportResume(@Req() req: any) {
    const user = req.user;
    const now = new Date();
    const hasActiveSubscription =
      !!user.subscriptionEnd && new Date(user.subscriptionEnd) > now;

    if (
      !['STARTER', 'PRO'].includes(user.role) ||
      !hasActiveSubscription
    ) {
      throw new ForbiddenException('Upgrade required');
    }

    return {
      message: 'Resume exported successfully',
    };
  }
}
