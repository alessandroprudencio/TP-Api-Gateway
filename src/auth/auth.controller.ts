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
import { lastValueFrom } from 'rxjs';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { Express } from 'express';

const STRING_ERROS_USER = ['Incorrect username or password.', 'User is not confirmed.', 'Password attempts exceeded'];

@Controller('api/v1/auth')
export class AuthController {
  constructor(private cognito: AwsCognitoService, private clientProxy: ClientProxyRabbitMq) {
    this.cognito = cognito;
    this.clientProxy = clientProxy;
  }

  private clientRabbitMQAdmin = this.clientProxy.getClientProxyRabbitmq('micro-admin-back');

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
      const loginAws = await this.cognito.login(authLoginDto);

      const userId = loginAws.idToken.payload['custom:_id'];

      const user = await lastValueFrom(this.clientRabbitMQAdmin.send('find-one-player', userId));

      const { jwtToken } = loginAws.idToken;

      const resp = {
        jwtToken,
        user,
      };

      return resp;
    } catch (error) {
      if (STRING_ERROS_USER.includes(error)) {
        throw new BadRequestException(error);
      }

      return new InternalServerErrorException(error.message);
    }
  }
}
