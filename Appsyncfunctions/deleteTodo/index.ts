import {
    DeleteItemCommand,
    DeleteItemCommandInput,
    DynamoDBClient,
    QueryCommand,
  } 
  
  from "@aws-sdk/client-dynamodb";
  import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
  import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
  const client = new DynamoDBClient({ region: "eu-central-1" });
  const TABLE_NAME = "Todos";
  


  export const handler = async (
    event: AppSyncResolverEvent<any>
  ): Promise<boolean> => {
    try {
      const UserID = (event.identity as AppSyncIdentityCognito).username;
      const title = event.arguments.input.title;
      const todoId = await getTodoId(UserID, title);
      console.log("todoId: ", todoId);
      const params: DeleteItemCommandInput = {
        TableName: TABLE_NAME,
        Key: marshall({
          UserID: UserID,
          TodoID: todoId[0].TodoID,
        }),
      };
      const command = new DeleteItemCommand(params);
      const response = await client.send(command);
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error in deleting todo");
    }
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
  

        const result = (response.Items || []).map((i) => unmarshall(i)) as any[];
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