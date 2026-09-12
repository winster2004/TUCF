import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdzunaService } from './adzuna.service';
import { ApplyJobDto } from './dto/apply-job.dto';

@Injectable()
export class JobsService {
  constructor(
    private adzuna: AdzunaService,
    private prisma: PrismaService,
  ) {}

  async search(query: string, location: string, page: number) {
    // Fix: guard incoming params so invalid input does not create provider-side failures.
    const safeQuery = String(query ?? '').trim();
    const safeLocation = String(location ?? '').trim();
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

    if (!safeQuery) {
      throw new BadRequestException('Query parameter "q" is required.');
    }

    const { data, diagnostics } = await this.adzuna.searchJobs(
      safeQuery,
      safeLocation,
      safePage,
    );

    const results = Array.isArray(data?.results) ? data.results : [];
    const total =
      typeof data?.count === 'number' && Number.isFinite(data.count)
        ? data.count
        : results.length;
    const hasMore = safePage * 10 < total;

    // Fix: robust response mapping to prevent crashes on missing nested fields.
    const jobs = results.map((job: any) => ({
      id: job?.id ?? '',
      title: job?.title ?? 'Untitled Job',
      company: job?.company?.display_name ?? 'Unknown Company',
      location: job?.location?.display_name ?? 'Unknown Location',
      redirectUrl: job?.redirect_url ?? '',
    }));

    return {
      jobs,
      page: safePage,
      hasMore,
      total,
      diagnostics,
    };
  }

  // Fix: expose raw Adzuna response for temporary diagnostics endpoint.
  async debugSearch(query: string, location: string, page: number) {
    const safeQuery = String(query ?? '').trim();
    const safeLocation = String(location ?? '').trim();
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

    if (!safeQuery) {
      throw new BadRequestException('Query parameter "q" is required.');
    }

    return this.adzuna.debugSearchJobs(safeQuery, safeLocation, safePage);
  }

  // 🔥 SAVE JOB
  async saveJob(userId: string, job: any) {
    return this.prisma.savedJob.create({
      data: {
        userId,
        jobId: job.id,
        title: job.title,
        company: job.company,
      },
    });
  }

  // 🔥 GET SAVED JOBS
  async getSavedJobs(userId: string) {
    return this.prisma.savedJob.findMany({
      where: { userId },
    });
  }

  // 🔥 APPLY JOB
  async applyJob(userId: string, job: ApplyJobDto) {
    try {
      const { jobId, title, company } = job ?? {};
      const jobIdStr = String(jobId ?? '').trim();
      const titleStr = String(title ?? '').trim();
      const companyStr = String(company ?? '').trim();

      if (!userId) {
        throw new BadRequestException('Invalid user context');
      }

      if (!jobIdStr || !titleStr || !companyStr) {
        throw new BadRequestException('jobId, title, and company are required');
      }

      const existing = await this.prisma.appliedJob.findFirst({
        where: { userId, jobId: jobIdStr },
      });

      if (existing) {
        throw new BadRequestException('Already applied');
      }

      const appliedJob = await this.prisma.appliedJob.create({
        data: {
          userId,
          jobId: jobIdStr,
          title: titleStr,
          company: companyStr,
        },
      });

      return {
        message: 'Job applied successfully',
        application: appliedJob,
      };
    } catch (error) {
      console.error('Failed to apply for job', {
        userId,
        job,
        error,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      if (process.env.NODE_ENV !== 'production') {
        throw error;
      }

      throw new InternalServerErrorException('Failed to apply for job');
    }
  }

  // 🔥 GET APPLIED JOBS
  async getAppliedJobs(userId: string) {
    return this.prisma.appliedJob.findMany({
      where: { userId },
      orderBy: { appliedAt: 'desc' },
    });
  }
}
