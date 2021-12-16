import { Module } from '@nestjs/common';
import { AwsCognitoConfig } from './aws-cognito.config';
import { AwsCognitoService } from './aws-cognito.service';

@Module({ exports: [AwsCognitoService, AwsCognitoConfig], providers: [AwsCognitoService, AwsCognitoConfig] })
export class AwsModule {}
