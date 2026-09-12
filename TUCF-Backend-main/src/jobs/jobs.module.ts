import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { AdzunaService } from './adzuna.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, AdzunaService],
})
export class JobsModule {}
