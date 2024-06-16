import * as given from "../../steps/given";
import * as then from "../../steps/then";
import * as when from "../../steps/when";

import Chance from "chance";
const chance = new Chance();

describe("Graphql/Appsync Todo operation", () => {
  let user: any = null;
  beforeAll(async () => {
    user = await given.an_authenticated_user();
  });
  it("UserID and title Should be saved in TodosTable", async () => {
    const title = chance.sentence({ words: 5 });
    const todoData = {
      UserID: user.username,
      title: title,
    };
    const createTodoResponse = await when.user_creates_a_todo(user, todoData);
    const todoId = createTodoResponse.TodoID;
    console.log("TODO ID -->", todoId);
    const ddbUser = await then.todo_exists_in_TodosTable(user.username, todoId);
    expect(ddbUser.UserID).toMatch(todoData.UserID);
    expect(ddbUser.title).toMatch(todoData.title);
  });
  it("User can list his/her todo", async () => {
    const title = chance.sentence({ words: 5 });
    const todoData = {
      UserID: user.username,
      title: title,
    };
    const createTodoResponse = await when.user_creates_a_todo(user, todoData);
    const todoId = createTodoResponse.TodoID;
    console.log("TODO ID -->", todoId);
    const todos = await when.user_calls_listTodos(user);
    expect(todos.length).toEqual(2);
  });
  it("User can delete his/her todo", async () => {
    const title = chance.sentence({ words: 5 });
    const todoData = {
      UserID: user.username,
      title: title,
    };
    const createTodoResponse = await when.user_creates_a_todo(user, todoData); // no of todos == 3
    const todoId = createTodoResponse.TodoID;
    console.log("TODO ID -->", todoId);

    const deleteTodoResponse = await when.user_calls_deleteTodo(
      user,
      todoData.title
    );
    console.log("Delete Response", deleteTodoResponse);

    const todos = await when.user_calls_listTodos(user);
    expect(todos.length).toEqual(2);
  });
  it("User can update his/her todo", async () => {
    const title = chance.sentence({ words: 5 });
    const todoData = {
      UserID: user.username,
      title: title,
    };
    const createTodoResponse = await when.user_creates_a_todo(user, todoData); // no of todos == 3
    const todoId = createTodoResponse.TodoID;
    console.log("TODO ID -->", todoId);

    const updateTodoTodoResponse = await when.user_calls_updateTodo(
      user,
      todoData.title
    );
    expect(updateTodoTodoResponse).toEqual(true);
  });
});