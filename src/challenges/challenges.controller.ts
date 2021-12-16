import { Body, Controller, Get, Injectable, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MongoIdValidation } from 'src/common/pipes/mongo-id-validation.pipe';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';

@Injectable()
@Controller('api/v1/challenges')
export class ChallengesController {
  clientProxyAdmin: ClientProxy;

  constructor(private clientProxyAdminRabbitMq: ClientProxyRabbitMq) {
    this.clientProxyAdmin = this.clientProxyAdminRabbitMq.getClientProxyRabbitmq('micro-challenge-back');
  }

  @Get()
  async findAll(): Promise<Observable<IChallenge>> {
    return this.clientProxyAdmin.send('challenge.findAll', {});
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createChallengeDto: CreateChallengeDto): Observable<any> {
    return this.clientProxyAdmin.emit('challenge.create', createChallengeDto);
  }

  @Get(':id')
  async findOne(@Param('id', MongoIdValidation) id: string): Promise<Observable<IChallenge>> {
    return this.clientProxyAdmin.send('challenge.findOne', id);
  }

  //   @Put(':id')
  //   @UsePipes(ValidationPipe)
  //   async update(
  //     @Param('id', MongoIdValidation) id: string,
  //     @Body() updateChallengeDto: UpdateChallengeDto,
  //   ): Promise<IChallenge> {
  //     return await this.clientProxyAdmin.update(id, updateChallengeDto);
  //   }

  //   @Delete(':id')
  //   async remove(@Param('id') id: string) {
  //     return await this.clientProxyAdmin.delete(id);
  //   }

  //   @Post(':id/match')
  //   @UsePipes(ValidationPipe)
  //   async setMatchChallenge(
  //     @Body() setMatchChallengeDto: SetMatchChallengeDto,
  //     @Param('id') id: string,
  //   ): Promise<IChallenge> {
  //     return await this.clientProxyAdmin.setMatchChallenge(id, setMatchChallengeDto);
  //   }
}
