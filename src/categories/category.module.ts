import { Module } from '@nestjs/common';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { CategoryController } from './category.controller';

@Module({
  controllers: [CategoryController],
  providers: [ClientProxyRabbitMq],
})
export class CategoryModule {}
