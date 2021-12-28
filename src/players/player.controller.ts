import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { lastValueFrom, Observable } from 'rxjs';
import { MongoIdValidation } from 'src/common/pipes/mongo-id-validation.pipe';
import { PlayersValidationParameterPipe } from 'src/common/pipes/validation-parameters.pipe';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { Express } from 'express';

@Controller('api/v1/players')
export class PlayerController {
  private clientRabbitMQAdmin = this.clientProxy.getClientProxyRabbitmq('micro-admin-back');
  private clientRabbitMQChallenge = this.clientProxy.getClientProxyRabbitmq('micro-challenge-back');

  constructor(private clientProxy: ClientProxyRabbitMq) {
    this.clientProxy = clientProxy;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query('name', PlayersValidationParameterPipe) name: string): Promise<Observable<IPlayer[]>> {
    return this.clientRabbitMQAdmin.send('find-all-player', name || '');
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@Body() createPlayerDto: CreatePlayerDto, @UploadedFile() avatar: Express.Multer.File) {
    this.clientRabbitMQAdmin.emit('create-user-player', { ...createPlayerDto, avatar });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', MongoIdValidation) id: string): Observable<IPlayer> {
    return this.clientRabbitMQAdmin.send('find-one-player', id);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id', MongoIdValidation) id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const resp = await lastValueFrom(
      this.clientRabbitMQAdmin.send('update-player', { id, player: updatePlayerDto, avatar }),
    );

    // if you created player then you must create it on the other microservice too
    if (resp._id) {
      this.clientRabbitMQChallenge.emit('update-player', { id: resp._id, resp });
    }

    return resp;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    this.clientRabbitMQAdmin.emit('delete-player', id);

    this.clientRabbitMQChallenge.emit('delete-player', id);
  }

  @Put(':id/set-push-token')
  @UseGuards(AuthGuard('jwt'))
  setPushToken(@Param('id') id: string, @Body() body: any) {
    this.clientRabbitMQAdmin.emit('set-push-token', { id, pushToken: body.pushToken });

    this.clientRabbitMQChallenge.emit('set-push-token', { id, pushToken: body.pushToken });
  }
}
