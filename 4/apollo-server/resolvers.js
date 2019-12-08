import GraphQLJSON from "graphql-type-json";
import { decodeJwt } from "./utils/jwtCreator";
import { async } from "rxjs/internal/scheduler/async";

export default {
  JSON: GraphQLJSON,

  Query: {
    hello: (root, { name }) => `Hello ${name || "World"}!`,
    todos: (root, args, { dataSources }) => dataSources.ds.getAllTodos(),
    todosForUser: (root, {userAuth}, { dataSources }) => {
      if(decodeJwt(userAuth, "secret")) {
        return dataSources.ds.getTodosForUser(userAuth)
      }
      return [{message:"SECRET NOT VALID"}]
    },
    todo: async (root, { id }, { dataSources}) => { 
      let debugtodo = await dataSources.ds.findTodo(id);
      return debugtodo
    }
  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = "My mutation completed!";
      context.pubsub.publish("hey", { mySub: message });
      return message;
    },

    addTodo: async (root, { id, newMessage, userAuth }, { dataSources }) => {
      const todo = {
        id: id,
        message: newMessage            
      }; 

      if(decodeJwt(userAuth, "secret")) {
        await dataSources.ds.addTodo(todo, userAuth);
        return todo;
      }
      
      return undefined;
    },

    updateTodo: async (root, { id, updateMessage }, { dataSources }) => {
      await dataSources.ds.updateTodo(id, updateMessage);

      return `todo with ID: ${id} was updated to ${updateMessage}`;
    },

    deleteTodo: (root, { id }, { dataSources }) => {
      dataSources.ds.deleteTodo(id);
      return `todo with ID ${id} was deleted`;
    }
  }
};
