import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AwsModule } from 'src/aws/aws.module';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    AwsModule,
  ],
  providers: [JwtStrategy, ClientProxyRabbitMq],
  controllers: [AuthController],
})
export class AuthModule {}
