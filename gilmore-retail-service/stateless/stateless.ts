import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from 'node:path';

import { Construct } from 'constructs';
import { Stage } from 'types';

export interface GilmoreRetailServiceStatelessStackProps
  extends cdk.StackProps {
  shared: {
    stage: Stage;
    serviceName: string;
    metricNamespace: string;
    logging: {
      logLevel: 'DEBUG' | 'INFO' | 'ERROR';
      logEvent: 'true' | 'false';
    };
  };
  stateless: {
    runtimes: lambda.Runtime;
  };
  vpc: ec2.Vpc;
}

export class GilmoreRetailServiceStatelessStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: GilmoreRetailServiceStatelessStackProps,
  ) {
    super(scope, id, props);

    const {
      shared: {
        stage,
        serviceName,
        metricNamespace,
        logging: { logLevel, logEvent },
      },
      vpc,
      stateless: { runtimes },
    } = props;

    const lambdaConfig = {
      LOG_LEVEL: logLevel,
      POWERTOOLS_LOGGER_LOG_EVENT: logEvent,
      POWERTOOLS_LOGGER_SAMPLE_RATE: '1',
      POWERTOOLS_TRACE_ENABLED: 'enabled',
      POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS: 'true',
      POWERTOOLS_SERVICE_NAME: serviceName,
      POWERTOOLS_TRACER_CAPTURE_RESPONSE: 'true',
      POWERTOOLS_METRICS_NAMESPACE: metricNamespace,
    };

    const createOrderLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'CreateOrderLambda', {
        functionName: `create-order-lambda-${stage}`,
        runtime: runtimes,
        entry: path.join(
          __dirname,
          './src/adapters/primary/create-order/create-order.adapter.ts',
        ),
        memorySize: 1024,
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        description: 'Create Order',
        logRetention: logs.RetentionDays.ONE_DAY,
        handler: 'handler',
        architecture: lambda.Architecture.ARM_64,
        tracing: lambda.Tracing.ACTIVE,
        environment: {
          ...lambdaConfig,
          STAGE: stage,
        },
        bundling: {
          minify: true,
          externalModules: ['@aws-sdk/*'],
        },
      });

    const api = new apigateway.RestApi(this, 'ApiGateway', {
      restApiName: `gilmore-retail-api-${stage}`,
      deployOptions: {
        stageName: stage,
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      deploy: true,
    });

    const root = api.root.addResource('v1');
    const ordersResource = root.addResource('orders');

    ordersResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createOrderLambda),
    );
  }
}
