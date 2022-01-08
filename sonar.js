// eslint-disable-next-line @typescript-eslint/no-var-requires
const scanner = require('sonarqube-scanner');

scanner(
  {
    token: process.env.SONARQUBE_TOKEN,
    serverUrl: 'https://sonarcloud.io/',
    options: {
      'sonar.projectKey': 'alessandroprudencio_TP-Api-Gateway',
      'sonar.projectName': 'tp-api-gateway',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.sources': 'src',
    },
  },
  () => process.exit(),
);
