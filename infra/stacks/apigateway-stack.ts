import { IUserPool } from "aws-cdk-lib/aws-cognito";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";

interface ApiGatewayProps extends cdk.StackProps {
  userPool: IUserPool;
  putTodoFunction: IFunction;
  getTodoFunctions: IFunction;
  updateTodoFunction: IFunction;
  deleteTodoFunction: IFunction;
}

export class ApiGatewayStack extends cdk.Stack {
  public readonly todoApi: apigw.RestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id, props);

    this.todoApi = new apigw.RestApi(this, "TodoRestAPI", {
      restApiName: "Todo Service",
      description: "Handles todo operations",
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowHeaders: ["*"],
      },
    });

    const authorizer = new apigw.CognitoUserPoolsAuthorizer(this, "TodoAuthorizer", {
      cognitoUserPools: [props.userPool],
    });

    const todoResource = this.todoApi.root.addResource("todo");
    todoResource.addMethod("GET", new apigw.LambdaIntegration(props.getTodoFunctions), { authorizer });
    todoResource.addMethod("POST", new apigw.LambdaIntegration(props.putTodoFunction), { authorizer });
    todoResource.addMethod("PUT", new apigw.LambdaIntegration(props.updateTodoFunction), { authorizer });
    todoResource.addMethod("DELETE", new apigw.LambdaIntegration(props.deleteTodoFunction), { authorizer });
  }
}