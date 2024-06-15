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
  todosTable: Table;
 
}

export class LambdaStack extends cdk.Stack {
// cognito
  public readonly addUserToTableFunc: NodejsFunction;
  // app sync functions
  public readonly createTodoFunc: NodejsFunction;
 public readonly listTodoFunc: NodejsFunction;
 public readonly deleteTodoFunc: NodejsFunction;
 public readonly updateTodoFunc: NodejsFunction;



 
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);
    this.addUserToTableFunc = this.addUserToUsersTable(props);
    this.createTodoFunc = this.createTodoFunction(props);
    this.listTodoFunc = this.listTodoFunction(props);
    this.deleteTodoFunc = this.deleteTodoFunction(props);
    this.updateTodoFunc = this.updateTodoFunction(props);
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

  createTodoFunction(props: LambdaStackProps) {
    const func = new NodejsFunction(this, "createTodoFunc", {
      functionName: "createTodoFunc",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../AppsyncFunctions/createTodo/index.ts"),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [props.todosTable.tableArn as string],
      })
    );
    return func;
  }


  listTodoFunction(props: LambdaStackProps) {
    const func = new NodejsFunction(this, "listTodoFunc", {
      functionName: "listTodoFunc",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../AppsyncFunctions/listTodos/index.ts"),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Query"],
        resources: [props.todosTable.tableArn as string],
      })
    );
    return func;
  }

  deleteTodoFunction(props: LambdaStackProps) {
    const func = new NodejsFunction(this, "deleteTodoFunc", {
      functionName: "deleteTodoFunc",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../AppsyncFunctions/deleteTodo/index.ts"),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Query", "dynamodb:DeleteItem"],
        resources: [
          props.todosTable.tableArn as string,
          props.todosTable.tableArn + "/index/getTodoId",
        ],
      })
    );
    return func;
  }

  updateTodoFunction(props: LambdaStackProps) {
    const func = new NodejsFunction(this, "updateTodoFunc", {
      functionName: "updateTodoFunc",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../AppsyncFunctions/updateTodo/index.ts"),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Query", "dynamodb:UpdateItem"],
        resources: [
          props.todosTable.tableArn as string,
          props.todosTable.tableArn + "/index/getTodoId",
        ],
      })
    );
    return func;
  }



}










