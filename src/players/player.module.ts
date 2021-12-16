import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { PlayerController } from './player.controller';

@Module({
  imports: [AuthModule],
  controllers: [PlayerController],
  providers: [ClientProxyRabbitMq],
})
export class PlayerModule {}
