import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(pool: Pool, adapter: PrismaPg) {
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
