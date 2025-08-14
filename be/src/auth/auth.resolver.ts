import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response.dto';
import { VerifyOtpInput } from './dto/verify-otp.input';
import { ResendOtpInput } from './dto/resend-otp.input';
import { OtpVerificationResponse } from './dto/otp-verification-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../user/schema/user.schema';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => OtpVerificationResponse)
  async verifyOtp(@Args('verifyOtpInput') verifyOtpInput: VerifyOtpInput): Promise<OtpVerificationResponse> {
    return this.authService.verifyOtp(verifyOtpInput.email, verifyOtpInput.otp);
  }

  @Mutation(() => String)
  async resendOtp(@Args('resendOtpInput') resendOtpInput: ResendOtpInput): Promise<string> {
    return this.authService.resendOtp(resendOtpInput.email);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Context() context): Promise<User> {
    return context.req.user;
  }
}