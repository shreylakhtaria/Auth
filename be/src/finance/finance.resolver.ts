import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { Finance } from './schema/finance.schema';
import { CreateFinanceInput } from './dto/create-finance.input';
import { UpdateFinanceInput } from './dto/update-finance.input';
import { FilterFinanceInput } from './dto/filter-finance.input';
import { PaginationInput } from './dto/pagination.input';
import { PaginatedFinanceResponse } from './dto/dashboard-summary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetCurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../user/schema/user.schema';

@Resolver(() => Finance)
export class FinanceResolver {
  constructor(private financeService: FinanceService) {}

  @Mutation(() => Finance)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  async createFinance(
    @Args('input') createFinanceInput: CreateFinanceInput,
    @GetCurrentUser() user: any,
  ): Promise<Finance> {
    return this.financeService.create(user.id, createFinanceInput);
  }

  @Mutation(() => Finance)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  async updateFinance(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateFinanceInput: UpdateFinanceInput,
    @GetCurrentUser() user: any,
  ): Promise<Finance> {
    return this.financeService.update(id, user.id, updateFinanceInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ANALYST, UserRole.ADMIN)
  async deleteFinance(
    @Args('id', { type: () => ID }) id: string,
    @GetCurrentUser() user: any,
  ): Promise<boolean> {
    return this.financeService.delete(id, user.id);
  }

  @Query(() => Finance)
  @UseGuards(JwtAuthGuard)
  async getFinance(
    @Args('id', { type: () => ID }) id: string,
    @GetCurrentUser() user: any,
  ): Promise<Finance> {
    return this.financeService.findById(id, user.id);
  }

  @Query(() => PaginatedFinanceResponse)
  @UseGuards(JwtAuthGuard)
  async listFinances(
    @Args('filter', { nullable: true }) filter?: FilterFinanceInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @GetCurrentUser() user?: any,
  ): Promise<PaginatedFinanceResponse> {
    const result = await this.financeService.findAll(
      user.id,
      filter,
      pagination,
    );
    return result;
  }
}

