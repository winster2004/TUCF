import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ApplyJobDto } from './dto/apply-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get('search')
  searchJobs(
    @Query('q') query: string,
    @Query('location') location: string,
    @Query('page') page: string,
  ) {
    // Public route: allow job discovery without requiring user authentication.
    // Fix: keep pagination stable with defensive page parsing.
    return this.jobsService.search(query, location, Number(page) || 1);
  }

  @Get('debug')
  debugSearchJobs(
    @Query('q') query: string,
    @Query('location') location: string,
    @Query('page') page: string,
  ) {
    // Public route: allow temporary raw provider diagnostics without JWT.
    // Fix: temporary endpoint returning raw Adzuna payload + diagnostics.
    return this.jobsService.debugSearch(query, location, Number(page) || 1);
  }

  // 🔥 SAVE JOB
  @UseGuards(JwtAuthGuard) // Protected route: saving jobs is user-specific state.
  @Post('save')
  saveJob(@Req() req: any, @Body() job: any) {
    const userId = req.user.id;
    return this.jobsService.saveJob(userId, job);
  }

  // 🔥 GET SAVED JOBS
  @UseGuards(JwtAuthGuard) // Protected route: returns only authenticated user's saved jobs.
  @Get('saved')
  getSavedJobs(@Req() req: any) {
    const userId = req.user.id;
    return this.jobsService.getSavedJobs(userId);
  }
  @UseGuards(JwtAuthGuard) // Protected route: applying to a job must be tied to authenticated user.
  @Post('apply')
  applyJob(@Req() req: any, @Body() body: ApplyJobDto) {
    const userId = req?.user?.id;

    if (!userId) {
      throw new BadRequestException('Invalid user context');
    }

    return this.jobsService.applyJob(userId, body);
  }

  @UseGuards(JwtAuthGuard) // Protected route: returns authenticated user's applied jobs.
  @Get('applied')
  getAppliedJobs(@Req() req: any) {
    const userId = req.user.id;
    return this.jobsService.getAppliedJobs(userId);
  }
}
