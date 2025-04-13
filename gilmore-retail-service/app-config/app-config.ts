import * as lambda from 'aws-cdk-lib/aws-lambda';

import { Region, Stage } from '../types';

export interface EnvironmentConfig {
  shared: {
    stage: Stage;
    serviceName: string;
    metricNamespace: string;
    logging: {
      logLevel: 'DEBUG' | 'INFO' | 'ERROR';
      logEvent: 'true' | 'false';
    };
  };
  env: {
    account: string;
    region: string;
  };
  stateless: {
    runtimes: lambda.Runtime;
  };
  stateful: {};
}

export const getEnvironmentConfig = (stage: Stage): EnvironmentConfig => {
  switch (stage) {
    case Stage.test:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `gilmore-retail-service-${Stage.test}`,
          metricNamespace: `gilmore-retail-${Stage.test}`,
          stage: Stage.test,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_22_X,
        },
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
    case Stage.staging:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `gilmore-retail-service-${Stage.staging}`,
          metricNamespace: `gilmore-retail-${Stage.staging}`,
          stage: Stage.staging,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_22_X,
        },
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
    case Stage.prod:
      return {
        shared: {
          logging: {
            logLevel: 'INFO',
            logEvent: 'true',
          },
          serviceName: `gilmore-retail-service-${Stage.prod}`,
          metricNamespace: `gilmore-retail-${Stage.prod}`,
          stage: Stage.prod,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_22_X,
        },
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
    case Stage.develop:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `gilmore-retail-service-${Stage.develop}`,
          metricNamespace: `gilmore-retail-${Stage.develop}`,
          stage: Stage.develop,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_22_X,
        },
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
    default:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `gilmore-retail-service-${stage}`,
          metricNamespace: `gilmore-retail-${stage}`,
          stage: stage,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_22_X,
        },
        env: {
          account: '123456789123',
          region: Region.london,
        },
        stateful: {},
      };
  }
};
