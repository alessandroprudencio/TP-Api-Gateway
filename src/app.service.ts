import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ICategory } from './categories/interfaces/category.interface';
import { ClientProxyRabbitMq } from './proxyrmq/client-proxy';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private logger: Logger;

  constructor(private clientProxy: ClientProxyRabbitMq, private configService: ConfigService) {
    this.logger = new Logger();
    this.clientProxy = clientProxy;
    this.configService = configService;
  }

  private clientRabbitMQAdmin = this.clientProxy.getClientProxyRabbitmq('micro-admin-back');
  private clientRabbitMQChallenge = this.clientProxy.getClientProxyRabbitmq('micro-challenge-back');

  async onApplicationBootstrap() {
    try {
      this.logger.log('Running seeders');

      await this.categorySeeder();

      // console.log('categoriesCreated=>', categoriesCreated);

      // if (process.env.NODE_ENV !== 'production') return;

      // if (categoriesCreated && categoriesCreated.length > 0) await this.adminSeeder(categoriesCreated);
    } catch (error) {
      console.log(error);
      this.logger.error('Error running seeders.');
    }
  }

  async categorySeeder() {
    const categoriesDatabase: any[] = await lastValueFrom(this.clientRabbitMQAdmin.send('find-all-category', ''));

    const categories = [
      {
        name: 'Categoria A',
        description: 'Jogadores de tênis 1ª classe',
        score: 30,
      },
      {
        name: 'Categoria B',
        description: 'Jogadores de tênis 2ª e 3ª classe',
        score: 20,
      },
      {
        name: 'Categoria C',
        description: 'Jogadores de tênis de classes inferiores ou iniciantes',
        score: 10,
      },
    ];

    for await (const category of categories) {
      try {
        if (categoriesDatabase.length === 0 || categoriesDatabase.find((item) => item.name !== category.name)) {
          this.logger.log(`Create category=>${JSON.stringify(category)}`);

          const resp = await this.createCategory(category);

          categoriesDatabase.push(resp);
        }
      } catch (error) {
        if (error.message.includes('E11000')) this.logger.log(`Seeder : ${error.message}`);
      }
    }

    return categoriesDatabase;
  }

  async createCategory(category: any) {
    const resp = await lastValueFrom(this.clientRabbitMQAdmin.send('create-category', category));

    if (resp._id) {
      this.clientRabbitMQChallenge.emit('create-category', resp);
    }

    return resp;
  }

  async adminSeeder(categoriesCreated: ICategory[]) {
    const users = [
      {
        name: this.configService.get('DEFAULT_PLAYER_NAME'),
        phoneNumber: this.configService.get('DEFAULT_PLAYER_PHONE_NUMBER'),
        email: this.configService.get('DEFAULT_PLAYER_EMAIL'),
        category: categoriesCreated[0]._id,
        password: this.configService.get('DEFAULT_PLAYER_PASSWORD'),
        avatar: this.configService.get('DEFAULT_PLAYER_AVATAR_URL'),
      },
    ];

    const usersDatabase: any[] = await lastValueFrom(this.clientRabbitMQAdmin.send('find-all-player', ''));

    const existUser = await usersDatabase.find((user) => user.email === this.configService.get('DEFAULT_PLAYER_EMAIL'));

    if (existUser) return existUser;

    for await (const user of users) {
      try {
        this.logger.log(`Create user=>${JSON.stringify(user)}`);

        this.clientRabbitMQAdmin.emit('create-user-player', { ...user });
      } catch (error) {
        if (error.message.includes('E11000')) this.logger.log(`Seeder : ${error.message}`);
      }
    }
  }
}
