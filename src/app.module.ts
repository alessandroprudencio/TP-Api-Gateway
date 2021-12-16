import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { CategoryModule } from './categories/category.module';
import { ChallengesModule } from './challenges/challenges.module';
import { PlayerModule } from './players/player.module';

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlayerModule,
    CategoryModule,
    ChallengesModule,
    AuthModule,
    AwsModule,
  ],
})
export class AppModule {}
