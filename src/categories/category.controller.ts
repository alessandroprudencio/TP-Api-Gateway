import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom, Observable } from 'rxjs';
import { MongoIdValidation } from 'src/common/pipes/mongo-id-validation.pipe';
import { PlayersValidationParameterPipe } from 'src/common/pipes/validation-parameters.pipe';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api/v1/categories')
export class CategoryController {
  constructor(private clientProxy: ClientProxyRabbitMq) {
    this.clientProxy = clientProxy;
  }

  private clientRabbitMQAdmin = this.clientProxy.getClientProxyRabbitmq('micro-admin-back');
  private clientRabbitMQChallenge = this.clientProxy.getClientProxyRabbitmq('micro-challenge-back');

  @Get()
  findAll(@Query('name', PlayersValidationParameterPipe) name: string): Observable<any> {
    return this.clientRabbitMQAdmin.send('find-all-category', name || '');
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const resp = await lastValueFrom(this.clientRabbitMQAdmin.send('create-category', createCategoryDto));

    // if you created player then you must create it on the other microservice too
    if (resp._id) {
      this.clientRabbitMQChallenge.emit('create-category', resp);
    }

    return resp;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', MongoIdValidation) id: string): Observable<any> {
    return this.clientRabbitMQAdmin.send('find-one-category', id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async update(@Param('id', MongoIdValidation) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const resp = await lastValueFrom(
      this.clientRabbitMQAdmin.send('update-category', { id, category: updateCategoryDto }),
    );

    if (resp._id) {
      this.clientRabbitMQChallenge.emit('update-category', { id: resp._id, category: resp });
    }

    return resp;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    this.clientRabbitMQAdmin.emit('delete-category', id);

    this.clientRabbitMQChallenge.emit('delete-category', id);
  }
}
