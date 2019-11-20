import GraphQLJSON from "graphql-type-json";

export default {
  JSON: GraphQLJSON,

  Query: {
    hello: (root, { name }) => `Hello ${name || "World"}!`,
    todos: (root, args, { db }) => db.get("todos").value(),
    todo: (root, { id, message }) => `Hallo Stefan`
  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = "My mutation completed!";
      context.pubsub.publish("hey", { mySub: message });
      return message;
    },

    addTodo: (root, { id, newMessage }, { db }) => {
      const todo = {
        // id: new Date().getUTCMilliseconds(),
        id: id,
        message: newMessage
      };

      db.get("todos")
        .push(todo)
        .last()
        .write();

      return todo;
    },

    updateTodo: (root, { id, updateMessage }, { db }) => {
      // const todoUpdate = db.get("todos").find({ id: 0 });
      // console.log(db.get("todos").value());
      // console.log(parseInt(id));
      // console.log(
      //   db
      //     .get("todos")
      //     .find({ id: id })
      //     .value()
      // );
      // console.log(db.get("todos").find({ id: 11 }));
      db.get("todos")
        .find({ id: id })
        .assign({ message: updateMessage })
        .write();
      return todo;
    },

    deleteTodo: (root, { id }, { db }) => {
      const todo = {
        id: id,
        message: message
      };

      db.get("todos")
        .push(todo)
        .last()
        .write();
      return todo;
    }
  }
};
