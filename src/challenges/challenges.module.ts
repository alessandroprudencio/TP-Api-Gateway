import { Module } from '@nestjs/common';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { ChallengesController } from './challenges.controller';

@Module({
  controllers: [ChallengesController],
  providers: [ClientProxyRabbitMq],
})
export class ChallengesModule {}
