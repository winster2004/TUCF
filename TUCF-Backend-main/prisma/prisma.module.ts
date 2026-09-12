import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    {
      provide: Pool,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not set');
        }

        return new Pool({ connectionString: databaseUrl });
      },
    },
    {
      provide: PrismaPg,
      inject: [Pool],
      useFactory: (pool: Pool) => new PrismaPg(pool),
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}