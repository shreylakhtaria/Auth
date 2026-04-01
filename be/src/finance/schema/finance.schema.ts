import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, registerEnumType, Float, ID } from '@nestjs/graphql';

export type FinanceDocument = Finance & Document;

export enum FinanceType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum FinanceCategory {
  SALARY = 'SALARY',
  FOOD = 'FOOD',
  UTILITIES = 'UTILITIES',
  TRANSPORTATION = 'TRANSPORTATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTHCARE = 'HEALTHCARE',
  OTHER = 'OTHER',
}

registerEnumType(FinanceType, {
  name: 'FinanceType',
});

registerEnumType(FinanceCategory, {
  name: 'FinanceCategory',
});

@Schema({ timestamps: true })
@ObjectType()
export class Finance {
  @Field(() => ID)
  _id?: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Field(() => Float)
  @Prop({ required: true, type: Number })
  amount: number;

  @Field(() => FinanceType)
  @Prop({ type: String, enum: FinanceType, required: true })
  type: FinanceType;

  @Field(() => FinanceCategory)
  @Prop({ type: String, enum: FinanceCategory, required: true })
  category: FinanceCategory;

  @Field()
  @Prop({ required: true, index: true })
  date: Date;

  @Field({ nullable: true })
  @Prop({ default: '' })
  description?: string;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FinanceSchema = SchemaFactory.createForClass(Finance);

// Add compound index for userId and date for efficient queries
FinanceSchema.index({ userId: 1, date: -1 });
FinanceSchema.index({ userId: 1, type: 1 });
