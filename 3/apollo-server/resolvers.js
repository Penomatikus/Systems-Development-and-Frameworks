import GraphQLJSON from "graphql-type-json";

export default {
  JSON: GraphQLJSON,

  Query: {
    hello: (root, { name }) => `Hello ${name || "World"}!`,
    todos: (root, args, { dataSources }) => dataSources.ds.getTodos(),
    todo: (root, { id }, { dataSources}) => { let debugtodo = dataSources.ds.findTodo(id);
                                                              //console.log(debugtodo);
                                                              return debugtodo
                                            }

  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = "My mutation completed!";
      context.pubsub.publish("hey", { mySub: message });
      return message;
    },

    addTodo: (root, { id, newMessage }, { dataSources }) => {
      const todo = {
        // id: new Date().getUTCMilliseconds(),
        id: id,
        message: newMessage
      };

      dataSources.ds.addTodo(todo);

      return todo;
    },

    updateTodo: (root, { id, updateMessage }, { dataSources }) => {
      const toBeUpdated = dataSources.ds.findTodo(id).message; // not save yet!(check undefined)
      dataSources.ds.updateTodo(id, updateMessage);


      return `todo with ID: ${id} was updated from ${toBeUpdated} to ${updateMessage}`;
    },

    deleteTodo: (root, { id }, { dataSources }) => {
      dataSources.ds.deleteTodo(id);
      return `todo with ID ${id} was deleted`;
    }
  }
};
