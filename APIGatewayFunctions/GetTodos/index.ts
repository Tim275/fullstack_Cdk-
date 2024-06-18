import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
const client = new DynamoDBClient({ region: "eu-central-1" });
const TABLE_NAME = "Todos";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Query string, ", event.queryStringParameters);

  if (!event.requestContext.authorizer) {
    throw new Error("No Authorization");
  }
  // Check if queryStringParameters is null or undefined before destructuring
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    throw new Error("No Id");
  }
  const { id } = event.queryStringParameters;

  try {
    const UserID = id;
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "UserID = :UserID",
      ExpressionAttributeValues: {
        ":UserID": { S: UserID },
      },
    };
    
    const command = new QueryCommand(params);
    const data = await client.send(command);
    const todos = data.Items?.map((item) => unmarshall(item));

    return {
      statusCode: 200,
      body: JSON.stringify({
        todos,
      }),
    };
  } catch (error) {
    console.error("Error occurred:", error);
    throw error; // or return an error response
  }
};