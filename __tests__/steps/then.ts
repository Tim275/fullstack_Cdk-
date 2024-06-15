import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({
  region: "ap-south-1",
});
export const user_exists_in_UsersTable = async (
  userSub: string
): Promise<any> => {
  let Item: unknown;
  console.log("Looking for User: ", userSub);

  const params = {
    TableName: "Users",
    Key: {
      UserID: { S: userSub },
    },
  };
  try {
    const getItemResponse = await ddbClient.send(new GetItemCommand(params));
    if (getItemResponse.Item) {
      Item = unmarshall(getItemResponse.Item);
    }
  } catch (error: any) {
    console.log("error");
  }
  console.log("Found Item -->", Item);
  return Item;
};

export const todo_exists_in_TodosTable = async (
  userId: string,
  todoId: string
): Promise<any> => {
  let Item: unknown;
  const params = {
    TableName: "Todos",
    Key: {
      UserID: { S: userId },
      TodoID: { S: todoId },
    },
  };
  try {
    const getItemResponse = await ddbClient.send(new GetItemCommand(params));
    if (getItemResponse.Item) {
      Item = unmarshall(getItemResponse.Item);
    }
  } catch (error: any) {
    console.log("error");
  }
  console.log("Found Item -->", Item);
  return Item;
};