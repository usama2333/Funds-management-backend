import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordReset]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,  // Make config globally available
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<string>('EMAIL_USER'), // Retrieve the user from .env
            pass: configService.get<string>('EMAIL_PASS'), // Retrieve the password from .env
          },
        },
        defaults: {
          from: '"No Reply" <usama.keen@gmail.com>', // Retrieve the from address from .env
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
