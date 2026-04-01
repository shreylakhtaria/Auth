import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsDateString,
  IsString,
  MaxLength,
} from 'class-validator';
import { FinanceType, FinanceCategory } from '../schema/finance.schema';

@InputType()
export class UpdateFinanceInput {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

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
  date?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
