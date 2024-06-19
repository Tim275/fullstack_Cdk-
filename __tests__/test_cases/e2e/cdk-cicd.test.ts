// Ensure you have the correct imports
import { handler as helloHandler } from "../../../cdk-cicd/services/hello";
// Adjust the import path and/or name as necessary
import { handler as handleraddtodo } from "../../../Appsyncfunctions/createTodo/index";    
import { handler as handlerdeletetodo } from "../../../Appsyncfunctions/deleteTodo/index";  
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AppSyncResolverEvent } from 'aws-lambda'; 
import AWS from 'aws-sdk';
import { QueryCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AppSyncIdentityCognito } from "aws-lambda";

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
  beforeEach(() => {
    // Setup mocks here if needed
  });

  afterEach(() => {
    // Cleanup mocks here if needed
    jest.resetAllMocks();
  });

  it(' create a todo item successfully', async () => {
    try {
      const result = await handleraddtodo(mockEvent);
      // für genaue angaben der Rückgabe
      expect(result).toEqual(expect.objectContaining({
        UserID: mockEvent.arguments.input.UserID,
        title: mockEvent.arguments.input.title,
        TodoID: expect.any(String), 
        completed: false,
      }));
    } catch (error) {
      console.error('Error during test execution', error);
      fail('Unexpected error occurred');
    }
  });
});

describe('Delete Todo Lambda Function', () => {
  beforeEach(() => {
    // Mock the DynamoDBClient send method
    jest.spyOn(DynamoDBClient.prototype, 'send').mockImplementation(async (command) => {
      if (command instanceof QueryCommand) {
        // Mock response for QueryCommand to simulate finding the TodoID
        return {
          Items: [
            marshall({
              UserID: '1',
              TodoID: '123',
              title: 'Test44',
            }),
          ],
        };
      } else if (command instanceof DeleteItemCommand) {
        // Mock response for DeleteItemCommand to simulate successful deletion
        return {};
      }
      throw new Error('Command not recognized');
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deletes a todo item successfully', async () => {
    const mockEvent: AppSyncResolverEvent<any> = {
      arguments: {
        input: {
          title: 'Test44',
        },
      },
      identity: {
        username: '1',
      } as AppSyncIdentityCognito,
    } as any; // Cast to any to bypass strict type checks for simplicity

    try {
      const result = await handlerdeletetodo(mockEvent);
      expect(result).toBe(true);
    } catch (error) {
      console.error('Error during test execution', error);
      fail('Unexpected error occurred');
    }
  });
});


