import GraphQLJSON from "graphql-type-json";

export default {
  JSON: GraphQLJSON,

  Query: {
    hello: (root, { name }) => `Hello ${name || "World"}!`,
    todos: (root, args, { db }) => db.get("todos").value(),
    todo: root => `Hallo Stefan`
  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = "My mutation completed!";
      context.pubsub.publish("hey", { mySub: message });
      return message;
    },
    addTodo: (root, { message }, { pubsub, db }) => {
      const todo = {
        id: new Date().getUTCMilliseconds().valueOf(),
        message: message
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
