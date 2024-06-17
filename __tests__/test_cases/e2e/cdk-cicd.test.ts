// Ensure you have the correct imports
import { handler as helloHandler } from "../../../cdk-cicd/services/hello";
// Adjust the import path and/or name as necessary
import { handler as handleraddtodo } from "../../../Appsyncfunctions/createTodo/index";    
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AppSyncResolverEvent } from 'aws-lambda'; // Ensure you have this import for the type
import AWS from 'aws-sdk';

// statuscode 200 als Rückgabe um hello world zu testen :)
describe('Hello describe test suite', () => {
    test('handler should return 200', async () => {
        const result = await helloHandler({}, {});
        expect(result.statusCode).toBe(200);
    });
});




// Mock data for the event
const mockEvent: AppSyncResolverEvent<any> = {
  arguments: {
    input: {
      UserID: '1',
      title: 'Test44',
    },
  },
  info: {
    fieldName: 'createTodo',
    parentTypeName: 'Mutation',
  },
  identity: null,
  request: {
    headers: {},
  },
} as any; // Cast to any to bypass strict type checks for simplicity

describe('Todo Lambda Function', () => {
  it('should create a todo item successfully', async () => {
    const result = await handleraddtodo(mockEvent);
    expect(result).toHaveProperty('UserID', mockEvent.arguments.input.UserID);
    expect(result).toHaveProperty('title', mockEvent.arguments.input.title);
    expect(result).toHaveProperty('TodoID');
    expect(result).toHaveProperty('completed', false);
  });




});
