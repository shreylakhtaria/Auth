import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsUrl,
  validateSync,
  IsOptional,
} from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  @IsString()
  MONGO_URI: string;

  @IsOptional()
  @IsString()
  JWT_SECRET: string;

  @IsOptional()
  @IsString()
  EMAIL_HOST: string;

  @IsOptional()
  @IsNumber()
  EMAIL_PORT: number;

  @IsOptional()
  @IsString()
  EMAIL_USER: string;

  @IsOptional()
  @IsString()
  EMAIL_PASS: string;

  @IsOptional()
  @IsString()
  EMAIL_FROM: string;

  @IsOptional()
  @IsNumber()
  PORT: number;

  @IsOptional()
  @IsUrl({ require_tld: false })
  FRONTEND_URL: string;
}

export function validate(config: Record<string, unknown>) {
  // Set defaults for development
  const configWithDefaults = {
    MONGO_URI: config.MONGO_URI || 'mongodb://localhost:27017/auth-dev',
    JWT_SECRET: config.JWT_SECRET || 'dev-secret-key-only-for-development-min-32-chars',
    EMAIL_HOST: config.EMAIL_HOST || 'smtp.gmail.com',
    EMAIL_PORT: config.EMAIL_PORT || 587,
    EMAIL_USER: config.EMAIL_USER || 'dev@example.com',
    EMAIL_PASS: config.EMAIL_PASS || 'dev-password',
    EMAIL_FROM: config.EMAIL_FROM || 'dev@example.com',
    PORT: config.PORT || 3001,
    FRONTEND_URL: config.FRONTEND_URL || 'http://localhost:3000',
  };

  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    configWithDefaults,
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.warn(
      'Config validation warnings:',
      errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('; '),
    );
  }

  return validatedConfig;
}
