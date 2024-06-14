import * as cognito from "@aws-sdk/client-cognito-identity-provider";
import Chance from "chance";
import * as dotenv from "dotenv";

const chance = new Chance();
dotenv.config();
const cognitoClient = new cognito.CognitoIdentityProviderClient({
  region: "eu-central-1",
});
export const a_random_user = () => {
  const firstName = chance.first({ nationality: "en" });
  const lastName = chance.first({ nationality: "en" });
  const name = `${firstName} ${lastName}`;
  const password = chance.string({ length: 10 });
  const email = `${firstName}-${lastName}@gmail.com`;
  return { name, password, email };
};

