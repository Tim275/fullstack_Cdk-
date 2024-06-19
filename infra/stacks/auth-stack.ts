import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_cognito as Cognito } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface authStackProps extends cdk.StackProps {
  addUserPostConfirmation: NodejsFunction;
}

export class AuthStack extends cdk.Stack {
  public readonly todoUserPool: Cognito.UserPool;
  public readonly todoUserPoolClient: Cognito.UserPoolClient;
  
  constructor(scope: Construct, id: string, props: authStackProps) {
    super(scope, id, props);
    this.todoUserPool = this.createUserPool(props);
    this.todoUserPoolClient = this.createWebClient();
    this.output();
  }
  createUserPool(props: authStackProps) {
    const userPool = new Cognito.UserPool(this, "TodoUserPool", {
      userPoolName: "TODO-USER-POOL",
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        name: new Cognito.StringAttribute({
          minLen: 3,
          maxLen: 20,
        }),
      },
      lambdaTriggers: {
        postConfirmation: props.addUserPostConfirmation,
      },
    });
    return userPool;
  }

  createWebClient() {
    const client = new Cognito.UserPoolClient(this, "TODO-USER-POOL-CLIENT", {
      userPool: this.todoUserPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    return client;
  }
  output() {
    new cdk.CfnOutput(this, "TodoPoolId", {
      value: this.todoUserPool.userPoolId,
    });
    new cdk.CfnOutput(this, "TodoPoolCleintId", {
      value: this.todoUserPoolClient.userPoolClientId,
    });
  }
}