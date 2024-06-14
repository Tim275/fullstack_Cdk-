import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");
import { join } from "path";



interface LambdaStackProps extends cdk.StackProps {
  usersTable: Table;
 
}

export class LambdaStack extends cdk.Stack {

  public readonly addUserToTableFunc: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);
    this.addUserToTableFunc = this.addUserToUsersTable(props);
  }

  addUserToUsersTable(props: LambdaStackProps) {
    const func = new NodejsFunction(this, "addUserFunc", {
      functionName: "addUserFunc",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../handlers/AddUserPostConfirmation/index.ts"),
    });
    
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [props.usersTable.tableArn as string],
      })
    );
    return func;
  }
}
