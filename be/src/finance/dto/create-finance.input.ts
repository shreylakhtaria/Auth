import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { FinanceType, FinanceCategory } from '../schema/finance.schema';

@InputType()
export class CreateFinanceInput {
  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @Field(() => FinanceType)
  @IsNotEmpty()
  @IsEnum(FinanceType)
  type: FinanceType;

  @Field(() => FinanceCategory)
  @IsNotEmpty()
  @IsEnum(FinanceCategory)
  category: FinanceCategory;

  @Field()
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
