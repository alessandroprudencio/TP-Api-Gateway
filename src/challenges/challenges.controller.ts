import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom, Observable } from 'rxjs';
import { MongoIdValidation } from 'src/common/pipes/mongo-id-validation.pipe';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { SetScoreChallengeDto } from './dto/set-score-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';

@Injectable()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private clientProxy: ClientProxyRabbitMq) {}

  private clientRabbitMQChallenge = this.clientProxy.getClientProxyRabbitmq('micro-challenge-back');

  @Get()
  async findAll(): Promise<Observable<IChallenge>> {
    return this.clientRabbitMQChallenge.send('find-all-challenge', {});
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createChallengeDto: CreateChallengeDto): Observable<any> {
    return this.clientRabbitMQChallenge.emit('create-challenge', createChallengeDto);
  }

  @Get(':id')
  async findOne(@Param('id', MongoIdValidation) id: string): Promise<Observable<IChallenge>> {
    return this.clientRabbitMQChallenge.send('find-one-challenge', id);
  }

  @Get(':playerId/players')
  async findChallengesPlayer(@Param('playerId', MongoIdValidation) playerId: string): Promise<Observable<IChallenge>> {
    return this.clientRabbitMQChallenge.send('find-challenges-player', playerId);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', MongoIdValidation) id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ): Promise<IChallenge> {
    return await lastValueFrom(
      this.clientRabbitMQChallenge.emit('update-challenge', { id, challenge: updateChallengeDto }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.clientRabbitMQChallenge.emit('delete-challenge', id);
  }

  @Post(':id/set-result')
  @UsePipes(ValidationPipe)
  async setScoreChallenge(
    @Param('id') id: string,
    @Body() setScoreDto: SetScoreChallengeDto,
  ): Promise<Observable<any>> {
    return this.clientRabbitMQChallenge.emit('set-result-challenge', { id, result: setScoreDto });
  }
}
