import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { Construct } from 'constructs';
import { getRemovalPolicyFromStage } from '../utils';

export interface GilmoreRetailServiceStatefulStackProps extends cdk.StackProps {
  shared: {
    stage: string;
  };
}

export class GilmoreRetailServiceStatefulStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(
    scope: Construct,
    id: string,
    props: GilmoreRetailServiceStatefulStackProps,
  ) {
    super(scope, id, props);

    const {
      shared: { stage },
    } = props;

    // we create our own VPC with 2 public and 2 private subnets
    // and 2 NAT gateways.
    this.vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'PrivateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    this.vpc.applyRemovalPolicy(getRemovalPolicyFromStage(stage));

    const cfnNatGateways = this.vpc.node
      .findAll()
      .filter(
        (instance) => instance instanceof ec2.CfnNatGateway,
      ) as ec2.CfnNatGateway[];

    cfnNatGateways.forEach((ngw) => {
      ngw.applyRemovalPolicy(getRemovalPolicyFromStage(stage));
    });
  }
}
