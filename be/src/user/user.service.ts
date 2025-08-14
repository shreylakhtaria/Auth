import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async updateById(id: string, updateData: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async updateByEmail(email: string, updateData: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate({ email }, updateData, { new: true }).exec();
  }

  async generateOtp(): Promise<string> {
    return crypto.randomInt(100000, 999999).toString();
  }

  async saveOtp(email: string, otp: string, expiryMinutes: number = 10): Promise<void> {
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + expiryMinutes);
    
    await this.userModel.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { new: true }
    ).exec();
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    
    if (!user || !user.otp || !user.otpExpiry) {
      return false;
    }

    const isOtpValid = user.otp === otp && user.otpExpiry > new Date();
    
    if (isOtpValid) {
      // Clear OTP and mark as verified
      await this.userModel.findOneAndUpdate(
        { email },
        { 
          $unset: { otp: 1, otpExpiry: 1 },
          isVerified: true 
        }
      ).exec();
    }

    return isOtpValid;
  }

  async markAsVerified(email: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email },
      { 
        isVerified: true,
        $unset: { otp: 1, otpExpiry: 1 }
      }
    ).exec();
  }

  async clearExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.userModel.updateMany(
      {
        $or: [
          { otpExpiry: { $lt: now } },
          { resetPasswordExpiry: { $lt: now } }
        ]
      },
      {
        $unset: {
          otp: 1,
          otpExpiry: 1,
          resetPasswordToken: 1,
          resetPasswordExpiry: 1
        }
      }
    ).exec();
  }
}