import { ObjectType, Field } from '@nestjs/graphql';
import { UserRole } from '../../user/schema/user.schema';

@ObjectType()
export class UserResponse {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  isVerified: boolean;
}

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => UserResponse)
  user: UserResponse;
}