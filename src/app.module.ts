import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guards';
import { DashboardModule } from './dashboard/dashboard.module';
import { MockUserMiddleware } from './middleware/MockUserMiddleware';


@Module({
  imports: [
    ConfigModule.forRoot(), // by default it is looking for file .env
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mysql123',
      database: 'demo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }), AuthModule, DashboardModule,
    
// TypeOrmModule.forRootAsync({
//   imports: [ConfigModule],
//   useFactory: (configService: ConfigService) => ({
//     type: 'mysql',
//     host: configService.get('DB_HOST'),
//     port: +configService.get('DB_PORT'),
//     username: configService.get('DB_USERNAME'),
//     password: configService.get('DB_PASSWORD'),
//     database: configService.get('DB_NAME'),
//     entities: [],
//     synchronize: true,
//   }),
//   inject: [ConfigService],
// }),

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Apply the RolesGuard globally
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MockUserMiddleware).forRoutes('*');
  }
}
