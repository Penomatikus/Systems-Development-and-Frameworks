import GraphQLJSON from "graphql-type-json";
import shortid from "shortid";

export default {
  JSON: GraphQLJSON,

  Query: {
    hello: (root, { name }) => `Hello ${name || "World"}!`,
    todos: (root, args, { db }) => db.get("todos").value()
  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = "My mutation completed!";
      context.pubsub.publish("hey", { mySub: message });
      return message;
    },
    addTodo: (root, { input }, { pubsub, db }) => {
      const todo = {
        id: shortid.generate(),
        message: input.text
      };

      db.get("todos")
        .push(todo)
        .last()
        .write();

      pubsub.publish("todos", { todoAdded: todo });

      return todo;
    }
  }
};
