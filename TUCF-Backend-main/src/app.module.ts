import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JobsModule } from './jobs/jobs.module';
import { SubscriptionModule } from './subscription/subscription.module';

import { PrismaModule } from '../prisma/prisma.module';
import { ResumeModule } from './resume/resume.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AtsModule } from './ats/ats.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env available everywhere
    }),
    PrismaModule,

    AuthModule,
    UserModule,
    JobsModule,
    SubscriptionModule,
    ResumeModule,
    PortfolioModule,
    AtsModule,
    RoadmapModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
