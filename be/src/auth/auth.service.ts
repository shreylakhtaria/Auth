import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response.dto';
import { EmailService } from './email.service';
import { UserService } from '../user/user.service';
import { Types } from 'mongoose';
import { UserDocument } from '../user/schema/user.schema';

// Ensure proper typing for the user object
interface User {
    _id: Types.ObjectId;
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const { email, password } = signupInput;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userService.create({
      email,
      password: hashedPassword,
    });

    // Generate OTP
    const otp = await this.userService.generateOtp();
    await this.userService.saveOtp(email, otp, 10); // 10 minutes expiry

    // Send OTP email
    await this.emailService.sendOtpEmail(email, otp);

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: (user._id as Types.ObjectId).toString(),
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const isValid = await this.userService.verifyOtp(email, otp);
    
    if (isValid) {
      return { success: true, message: 'OTP verified successfully. Account activated.' };
    } else {
      return { success: false, message: 'Invalid or expired OTP.' };
    }
  }

  async resendOtp(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    // Generate new OTP
    const otp = await this.userService.generateOtp();
    await this.userService.saveOtp(email, otp, 10);

    // Send OTP email
    await this.emailService.sendOtpEmail(email, otp);

    return 'OTP sent successfully';
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    // Find user
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: (user?._id as Types.ObjectId).toString(),
        email: user?.email,
        role: user?.role,
        isVerified: user?.isVerified,
      },
    };
  }

  async validateUser(payload: any): Promise<any> {
    try {
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return {
        id: (user._id as Types.ObjectId).toString(),
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}