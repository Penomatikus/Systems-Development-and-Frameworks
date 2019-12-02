import GraphQLJSON from "graphql-type-json";
import { decodeJwt } from "./utils/jwtCreator";

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
    todo: (root, { id }, { dataSources}) => { 
      let debugtodo = dataSources.ds.findTodo(id);
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

    addTodo: (root, { id, newMessage, userAuth }, { dataSources }) => {
      //console.log(newMessage);
      //console.log(userAuth);
      const todo = {
        // id: new Date().getUTCMilliseconds(),
        id: id,
        message: newMessage            
      }; 

      if(decodeJwt(userAuth, "secret")) {
        dataSources.ds.addTodo(todo, userAuth);
        return todo;
      }
      
      return undefined;
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
