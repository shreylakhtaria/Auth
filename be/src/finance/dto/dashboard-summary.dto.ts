import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { Finance } from '../schema/finance.schema';

@ObjectType()
export class PaginatedFinanceResponse {
  @Field(() => [Finance])
  items: Finance[];

  @Field(() => Int)
  total: number;
}

@ObjectType()
export class CategoryTotal {
  @Field()
  category: string;

  @Field(() => Float)
  total: number;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class DashboardSummary {
  @Field(() => Float)
  totalIncome: number;

  @Field(() => Float)
  totalExpense: number;

  @Field(() => Float)
  netBalance: number;

  @Field(() => [CategoryTotal])
  categoryWiseTotals: CategoryTotal[];

  @Field(() => [Finance])
  recentActivity: Finance[];

  @Field()
  periodStart: Date;

  @Field()
  periodEnd: Date;
}
