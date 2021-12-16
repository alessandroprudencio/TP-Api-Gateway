import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { AuthLoginDto } from './dtos/auth-login.dto';

const STRING_ERROS_USER = ['Incorrect username or password.', 'User is not confirmed.', 'Password attempts exceeded'];

@Controller('api/v1/auth')
export class AuthController {
  private clientRabbitMQAdmin = this.clientProxy.getClientProxyRabbitmq('micro-admin-back');

  constructor(private cognito: AwsCognitoService, private clientProxy: ClientProxyRabbitMq) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('avatar'))
  async register(@Body() createPlayerDto: CreatePlayerDto, @UploadedFile() avatar: Express.Multer.File) {
    this.clientRabbitMQAdmin.emit('create-user-player', { ...createPlayerDto, avatar });
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginDto: AuthLoginDto) {
    try {
      return await this.cognito.login(authLoginDto);
    } catch (error) {
      if (STRING_ERROS_USER.includes(error)) {
        throw new BadRequestException(error);
      }

      return new InternalServerErrorException(error.message);
    }
  }
}
