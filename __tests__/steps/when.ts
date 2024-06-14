import * as dotenv from "dotenv";
dotenv.config();
import * as cognito from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new cognito.CognitoIdentityProviderClient({
  region: "eu-central-1",
});

export const a_user_signs_up = async (
  password: string,
  email: string,
  name: string
): Promise<string> => {
  const userPoolId = process.env.ID_USER_POOL;
  const clientId = process.env.CLIENT_USER_POOL_ID;
  const username = email;
  console.log(`[${email}] --> Signing up`);

  const command = new cognito.SignUpCommand({
    ClientId: clientId,
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
    ],
  });

  const singUpResponse = await cognitoClient.send(command);
  const userSub = singUpResponse.UserSub;
  const adminCommand: cognito.AdminConfirmSignUpCommandInput = {
    Username: userSub as string,
    UserPoolId: userPoolId as string,
  };

  await cognitoClient.send(new cognito.AdminConfirmSignUpCommand(adminCommand));
  console.log(`[${email}] --> Confirmed Sign Up`);

  return userSub as string;
};
