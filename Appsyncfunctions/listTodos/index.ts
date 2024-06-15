import {
    DynamoDBClient,
    QueryCommand,
    QueryCommandInput,
  } from "@aws-sdk/client-dynamodb";

  import { unmarshall } from "@aws-sdk/util-dynamodb";
  import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";

  const client = new DynamoDBClient({ region: "eu-central-1" });
  const TABLE_NAME = "Todos";
  
  export const handler = async (event: AppSyncResolverEvent<any>) => {
    
    try {
      const identity = event.identity as AppSyncIdentityCognito;
      const UserID = identity.sub;
     
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
      return todos;
    } catch (error) {
      console.error("Error occurred:", error);
      throw error; 
    }
  };