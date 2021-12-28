<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://github.com/alessandroprudencio/TP-Api-Gateway/blob/develop/src/assets/logo.png" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">Tennis Player, connecting tennis players.</p>

## Description

API Gateway that encapsulates the system's internal architecture and offers a custom API for each client.

## Architecture

<img src="https://github.com/alessandroprudencio/TP-Api-Gateway/blob/develop/src/assets/microsservice-architeture.png" width="1220" alt="Architecture img" />

## Installation

Use .env.example to create a new .env at the root of the directory and set all variables.

## Running the app

```bash
$ docker-compose up --build
```

The player will be created according to what was filled in the variables ​​DEFAULT PLAYER, use it to login to the application, remember that an email will be sent to confirm the user.

## Built with

- [NestJS](https://nestjs.com/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [MongoDB](https://www.mongodb.com/)
- [Bitnami](https://bitnami.com/)
- [AWS](https://aws.amazon.com/)
- [AWS S3](https://aws.amazon.com/s3)

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
