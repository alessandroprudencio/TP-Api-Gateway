import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AwsCognitoConfig } from 'src/aws/aws-cognito.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger();

  constructor(private _awsCognitoConfig: AwsCognitoConfig) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,

        rateLimit: true,

        jwksRequestsPerMinute: 5,

        jwksUri: `${_awsCognitoConfig.authority}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      audience: _awsCognitoConfig.clientId,

      issuer: _awsCognitoConfig.authority,
    });
  }

  public async validate(payload: any) {
    this.logger.log(`Payload login=> ${JSON.stringify(payload)}`);

    return { userId: payload.sub, email: payload.email };
  }
}
