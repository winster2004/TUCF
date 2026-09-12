import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const now = new Date();

    if (!user) {
      throw new ForbiddenException('Upgrade required');
    }
    const hasActiveSubscription =
      !!user.subscriptionEnd && new Date(user.subscriptionEnd) > now;

    if (!hasActiveSubscription) {
      request.user.role = 'FREE';
      request.user.isActive = false;
      throw new ForbiddenException('Upgrade required');
    }

    request.user.isActive = true;
    if (user.role === 'FREE') {
      throw new ForbiddenException('Upgrade required');
    }

    return true;
  }
}
