import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SubscriptionGuard } from '../common/guard/subscription.guard';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  @Post('generate')
  generatePortfolio(@Body() payload: Record<string, unknown>) {
    return this.portfolioService.generate(payload);
  }

  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  @Post('resume')
  @UseInterceptors(FileInterceptor('resume'))
  uploadResume(@UploadedFile() resume: { originalname?: string } | undefined) {
    return this.portfolioService.uploadResume(resume);
  }
}
