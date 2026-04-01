import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardSummary, CategoryTotal } from './dto/dashboard-summary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetCurrentUser } from '../auth/current-user.decorator';
import { Finance } from './schema/finance.schema';

@Resolver()
export class DashboardResolver {
  constructor(private dashboardService: DashboardService) {}

  @Query(() => DashboardSummary)
  @UseGuards(JwtAuthGuard)
  async getDashboardSummary(
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
    @GetCurrentUser() user?: any,
  ): Promise<DashboardSummary> {
    return this.dashboardService.getDashboardSummary(
      user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Query(() => Number)
  @UseGuards(JwtAuthGuard)
  async getTotalIncome(
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
    @GetCurrentUser() user?: any,
  ): Promise<number> {
    return this.dashboardService.getTotalIncome(
      user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Query(() => Number)
  @UseGuards(JwtAuthGuard)
  async getTotalExpense(
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
    @GetCurrentUser() user?: any,
  ): Promise<number> {
    return this.dashboardService.getTotalExpense(
      user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Query(() => Number)
  @UseGuards(JwtAuthGuard)
  async getNetBalance(
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
    @GetCurrentUser() user?: any,
  ): Promise<number> {
    return this.dashboardService.getNetBalance(
      user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Query(() => [CategoryTotal])
  @UseGuards(JwtAuthGuard)
  async getCategoryWiseTotals(
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
    @GetCurrentUser() user?: any,
  ): Promise<CategoryTotal[]> {
    return this.dashboardService.getCategoryWiseTotals(
      user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Query(() => [Finance])
  @UseGuards(JwtAuthGuard)
  async getRecentActivity(
    @Args('limit', { type: () => Number, nullable: true }) limit?: number,
    @GetCurrentUser() user?: any,
  ): Promise<Finance[]> {
    return this.dashboardService.getRecentActivity(
      user.id,
      limit || 10,
    );
  }
}
