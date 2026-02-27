import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EmailService } from './email.service';
import { TokenCleanupService } from './token-cleanup.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    JwtAuthGuard,
    EmailService,
    TokenCleanupService,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule { }