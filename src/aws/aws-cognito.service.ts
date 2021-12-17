import { Injectable } from '@nestjs/common';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthLoginDto } from 'src/auth/dtos/auth-login.dto';
import { AwsCognitoConfig } from 'src/aws/aws-cognito.config';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor(private cognitoConfig: AwsCognitoConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.cognitoConfig.userPoolId,
      ClientId: this.cognitoConfig.clientId,
    });
  }

  async login(userDto: AuthLoginDto) {
    return new Promise<any>((resolve, reject) => {
      const { email, password } = userDto;

      const authenticationData = {
        Username: email,
        Password: password,
      };

      const authenticationDetails = new AuthenticationDetails(authenticationData);

      const userData = {
        Username: email,
        Pool: this.userPool,
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          return resolve(result);
        },

        onFailure: function (err) {
          return reject(err.message || JSON.stringify(err));
        },
      });
    });
  }
}
