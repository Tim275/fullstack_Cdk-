#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DataStack } from '../infra/stacks/Datastack';
import { LambdaStack } from '../infra/stacks/Lambdastack'; // its aws cognito
import { AuthStack } from '../infra/stacks/auth-stack';
import { AppsyncStack } from '../infra/stacks/appsync-stack';

const app = new cdk.App();
const databasestack = new DataStack(app, 'Databasestack');

const lambdaStack = new LambdaStack(app, 'Lambdastack', {
    usersTable: databasestack.usersTable,
    todosTable: databasestack.todosTable,
});

const authStack = new AuthStack(app, "AuthStack", {
    addUserPostConfirmation: lambdaStack.addUserToTableFunc,
}); // verbunden mit lambda

const appsyncStack = new AppsyncStack(app, "AppsyncStack", {
    userPool: authStack.todoUserPool,
    createTodoFunc: lambdaStack.createTodoFunc,
});