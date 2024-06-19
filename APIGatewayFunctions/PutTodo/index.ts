import {
    PutItemCommand,
    DynamoDBClient,
    PutItemCommandInput,
  } from "@aws-sdk/client-dynamodb";
  import { marshall } from "@aws-sdk/util-dynamodb";
  import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
  import { ulid } from "ulid";
  const client = new DynamoDBClient({ region: "eu-central-1" });
  const TABLE_NAME = "Todos";
  
  export const handler = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    if (!event.requestContext.authorizer) {
      throw new Error("No Authorization");
    }
    const { id, title } = JSON.parse(event.body!);
    if (!id || !title) throw new Error("No id or Title is Provide");
    const TodoID = ulid();
    const params: PutItemCommandInput = {
      TableName: TABLE_NAME,
      Item: marshall({
        UserID: id,
        TodoID,
        title: title,
        completed: false,
      }),
    };
    try {
      const response = await client.send(new PutItemCommand(params));
      if (response.$metadata.httpStatusCode === 200) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Todo Created Successfully",
          }),
        };
      }
    } catch (error: any) {
      throw new Error(error);
    }
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Todo Creation Failed",
      }),
    };
  };