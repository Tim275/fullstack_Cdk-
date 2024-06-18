import {
    DynamoDBClient,
    QueryCommand,
    UpdateItemCommand,
    UpdateItemCommandInput,
  } from "@aws-sdk/client-dynamodb";
  import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
  import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
  const client = new DynamoDBClient({ region: "eu-central-1" });
  const TABLE_NAME = "Todos";
  export interface DynobaseGeneratedType {
    completed: boolean;
    UserID: string;
    TodoID: string;
    title: string;
  }
  export const handler = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    if (!event.requestContext.authorizer) {
      throw new Error("No Authrization");
    }
  
    const { id, title } = JSON.parse(event.body!);
    const todoId = await getTodoId(id, title);
  
    console.log("todoId: ", todoId);
    const params: UpdateItemCommandInput = {
      TableName: TABLE_NAME,
      Key: marshall({
        UserID: id,
        TodoID: todoId[0].TodoID,
      }),
      UpdateExpression: "set completed = :completed",
      ExpressionAttributeValues: {
        ":completed": { BOOL: true },
      },
    };
  
    const response = await client.send(new UpdateItemCommand(params));
    if (response) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Todo Updated Successfully",
        }),
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Todo Not Updated",
      }),
    };
  };
  
  const getTodoId = async (UserID: string, title: string): Promise<any> => {
    console.log("UserID: ", UserID);
    console.log("title: ", title);
  
    try {
      const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "#DDB_UserID = :pkey and #DDB_title = :skey",
        IndexName: "getTodoId",
        ExpressionAttributeNames: {
          "#DDB_UserID": "UserID",
          "#DDB_title": "title",
        },
        ExpressionAttributeValues: {
          ":pkey": { S: UserID },
          ":skey": { S: title },
        },
      });
      try {
        const response = await client.send(command);
  
        // Unmarshalling DynamoDB items into JS objects and casting to TS types
        const result = (response.Items || []).map((i) =>
          unmarshall(i)
        ) as DynobaseGeneratedType[];
        console.log("result: ", result);
        return result;
      } catch (error) {
        console.error(
          `Failed to fetch data from DynamoDB. Error: ${JSON.stringify(
            error,
            null,
            2
          )}`
        );
  
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };