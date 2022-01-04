import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  welcome() {
    return 'Welcome to the Tennis Player api ❤️';
  }
}
