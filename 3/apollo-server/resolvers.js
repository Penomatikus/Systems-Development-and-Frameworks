import GraphQLJSON from "graphql-type-json";

export default {
  JSON: GraphQLJSON,

  Query: {
    hello: (root, { name }) => `Hello ${name || "World"}!`,
    todos: (root, args, { ds }) => ds.getTodos(),
    todo: (root, { id }, { ds }) => { let debugtodo = ds.findTodo(id);console.log(debugtodo);return debugtodo}
  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = "My mutation completed!";
      context.pubsub.publish("hey", { mySub: message });
      return message;
    },

    addTodo: (root, { id, newMessage }, { ds }) => {
      const todo = {
        // id: new Date().getUTCMilliseconds(),
        id: id,
        message: newMessage
      };

      ds.addTodo(todo);

      return todo;
    },

    updateTodo: (root, { id, updateMessage }, { ds }) => {
      const toBeUpdated = ds.findTodo(id).message; // not save yet!(check undefined)
      ds.updateTodo(id, updateMessage);


      return `todo with ID: ${id} was updated from ${toBeUpdated} to ${updateMessage}`;
    },

    deleteTodo: (root, { id }, { ds }) => {
      ds.deleteTodo(id);
      return `todo with ID ${id} was deleted`;
    }
  }
};
