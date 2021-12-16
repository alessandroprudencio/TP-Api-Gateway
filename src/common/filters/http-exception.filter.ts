import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    const request = ctx.getRequest();

    const error = exception instanceof HttpException ? exception.getResponse() : exception;

    const status = this.getStatus(error, exception);

    this.logger.error(`Http Status: ${status} Error Message: ${JSON.stringify(error)}`);

    console.log(error);

    response.status(status).json({
      timestamp: new Date().toISOString(),
      error,
      path: request.url,
      statusCode: status,
    });
  }

  private getStatus(error: any, exception: unknown) {
    if (error.statusCode) return error.statusCode;

    if (exception instanceof HttpException) return exception.getStatus();

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
