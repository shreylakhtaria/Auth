import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class OtpVerificationResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
