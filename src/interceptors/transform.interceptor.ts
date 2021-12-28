import { ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  intercept(context: ExecutionContext): any {
    const ctx = context.switchToHttp();

    this.logger.log(`New request: ${ctx.getRequest()}`);
  }
}
