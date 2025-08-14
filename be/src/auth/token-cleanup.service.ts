import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';

@Injectable()
export class TokenCleanupService {
  constructor(
    private userService: UserService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredTokens() {
    await this.userService.clearExpiredTokens();
    console.log('Cleaned up expired tokens (OTP and password reset)');
  }
}