import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizePlan(plan: string | null | undefined): 'STARTER' | 'PRO' | null {
    if (!plan) {
      return null;
    }

    const normalized = plan.trim().toUpperCase();
    if (normalized === Role.STARTER || normalized === Role.PRO) {
      return normalized;
    }

    return null;
  }

  private normalizeRole(role: Role | null | undefined): Role {
    return role ?? Role.FREE;
  }

  private async getUserSubscriptionContext(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        subscriptionStart: true,
        subscriptionEnd: true,
      },
    });
  }

  private isActive(subscriptionEnd: Date | null) {
    if (!subscriptionEnd || Number.isNaN(subscriptionEnd.getTime())) {
      return false;
    }

    const now = new Date();
    return subscriptionEnd > now;
  }

  private isExpired(subscriptionEnd: Date | null) {
    if (!subscriptionEnd || Number.isNaN(subscriptionEnd.getTime())) {
      return false;
    }

    const now = new Date();
    return subscriptionEnd <= now;
  }

  private async applyFreeFallbackIfExpired(user: {
    id: string;
    role: Role;
    subscriptionEnd: Date | null;
  }) {
    if (!this.isExpired(user.subscriptionEnd)) {
      return user;
    }

    if (user.role !== Role.FREE) {
      return this.prisma.user.update({
        where: { id: user.id },
        data: { role: Role.FREE },
        select: {
          id: true,
          role: true,
          subscriptionStart: true,
          subscriptionEnd: true,
        },
      });
    }

    return {
      ...user,
      subscriptionStart: null,
    };
  }

  private async applyPlanUpgrade(userId: string, plan: 'STARTER' | 'PRO') {
    const now = new Date();
    const subscriptionEnd = new Date(now);
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);

    const verified = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          role: plan,
          subscriptionStart: now,
          subscriptionEnd,
        },
      });

      return tx.user.findUnique({
        where: { id: userId },
        select: {
          role: true,
          subscriptionStart: true,
          subscriptionEnd: true,
        },
      });
    });

    if (!verified) {
      throw new BadRequestException('User not found');
    }

    if (verified.role !== plan) {
      throw new InternalServerErrorException(
        `Role update failed. Expected ${plan}, found ${verified.role}`,
      );
    }

    return verified;
  }

  async upgradeSubscription(userId: string, plan: string) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    const normalizedPlan = this.normalizePlan(plan);
    if (!normalizedPlan) {
      throw new BadRequestException('plan must be STARTER or PRO');
    }

    const userRaw = await this.getUserSubscriptionContext(userId);
    if (!userRaw) {
      throw new BadRequestException('User not found');
    }

    const currentRole = this.normalizeRole(userRaw.role);

    const user = await this.applyFreeFallbackIfExpired({
      id: userRaw.id,
      role: currentRole,
      subscriptionEnd: userRaw.subscriptionEnd,
    });

    if (user.role === normalizedPlan) {
      throw new BadRequestException(`Already on ${normalizedPlan} plan`);
    }

    if (user.role === Role.PRO && normalizedPlan === Role.STARTER) {
      throw new ForbiddenException('Downgrade is not allowed');
    }

    const updatedUser = await this.applyPlanUpgrade(userId, normalizedPlan);

    return {
      role: updatedUser.role,
      subscriptionStart: updatedUser.subscriptionStart,
      isActive: true,
      subscriptionEnd: updatedUser.subscriptionEnd,
    };
  }

  async upgradeToStarter(userId: string) {
    return this.upgradeSubscription(userId, Role.STARTER);
  }

  async upgradeToPro(userId: string) {
    return this.upgradeSubscription(userId, Role.PRO);
  }

  async getSubscriptionStatus(userId: string) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        subscriptionStart: true,
        subscriptionEnd: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const currentRole = this.normalizeRole(user.role);
    const isActive = this.isActive(user.subscriptionEnd);
    const effectiveRole = isActive ? currentRole : Role.FREE;

    console.log('[SUBSCRIPTION]', {
      userId,
      currentRole,
      subscriptionEnd: user.subscriptionEnd,
      isActive,
    });

    if (this.isExpired(user.subscriptionEnd) && currentRole !== Role.FREE) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: Role.FREE },
      });
    }

    return {
      role: effectiveRole,
      subscriptionStart: user.subscriptionStart,
      isActive,
      subscriptionEnd: user.subscriptionEnd,
    };
  }
}
