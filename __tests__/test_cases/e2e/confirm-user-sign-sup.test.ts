import * as given from "../../steps/given";
import * as then from "../../steps/then";
import * as when from "../../steps/when";

describe("AuthFlow Test", () => {
  it("When User SignUps his/her details should be saved in Users Table", async () => {
    const { name, password, email } = given.a_random_user();
    const userSub = await when.a_user_signs_up(password, email, name);
    const ddbUser = await then.user_exists_in_UsersTable(userSub);
    expect(ddbUser.UserID).toMatch(userSub);
  });
});