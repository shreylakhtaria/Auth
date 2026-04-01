import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { FinanceType, FinanceCategory } from '../schema/finance.schema';

@InputType()
export class FilterFinanceInput {
  @Field(() => FinanceType, { nullable: true })
  @IsOptional()
  @IsEnum(FinanceType)
  type?: FinanceType;

  @Field(() => FinanceCategory, { nullable: true })
  @IsOptional()
  @IsEnum(FinanceCategory)
  category?: FinanceCategory;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
