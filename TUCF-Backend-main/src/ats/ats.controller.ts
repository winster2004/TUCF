import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SubscriptionGuard } from '../common/guard/subscription.guard';
import { AtsService } from './ats.service';

@Controller('ats')
export class AtsController {
  constructor(private readonly atsService: AtsService) {}

  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  @Post('analyze')
  @UseInterceptors(FileInterceptor('resume'))
  analyze(@UploadedFile() resume: { buffer?: Buffer } | undefined, @Body('jobDescription') jobDescription: string) {
    return this.atsService.analyze(resume, jobDescription);
  }
}
