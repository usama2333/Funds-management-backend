import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
// import { UserModule } from './user/user.module';
// import { SeederService } from './seeder/seeder.service';
import { User } from './user/entities/user.entity';


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
      entities: [__dirname + '/**/*.entity{.ts,.js}', User],
      synchronize: true,
    }), AuthModule, AdminModule,
    
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
    // SeederService
  ],
})
export class AppModule {}
