import { shallowMount } from "@vue/test-utils";
import ListItem from "@/components/ListItem.vue";

import fs from 'fs'
import path from 'path'
import resolvers from '../../apollo-server/resolvers'

import { TodoAPI } from '../../apollo-server/utils/testds'

const { ApolloServer, gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');

const typeDefs = fs.readFileSync(path.resolve(__dirname, '../../apollo-server/schema.graphql'), { encoding: 'utf8' })

const mok = [{id: 1,message:"a"},{id: 2,message:"b"}];  
const mocksds = new TodoAPI(mok);



const allMocks = () => mocksds



const ADD_TODO = gql `
mutation addTodo($id: Int!, $newMessage: String!){
  addTodo(
    id: $id
    newMessage: $newMessage
  ){
      id
      message
    }
}
`;

const UPDATE_TODO = gql `
mutation updateTodo($id: Int!, $updateMessage: String!){
  updateTodo(
          id: $id
          updateMessage: $updateMessage

  )}
`;

const DELETE_TODO = gql `
mutation deleteTodo($id: Int!){
  deleteTodo(
    id: $id
  )
}
`;

const GET_TODO = gql `
    query todo($id: Int!) {
    todo(id: $id) {
      id
      message
    }
  }
`;
const GET_TODOS = gql `
        {
        todos   {
          id
          message 
        }
        }
`;

//actual Test

describe('Test Todo query', () => {
    it('finds a todo by id', async() => {

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: mocksds
            }),
            context: () => ({
                id: 1,
                message: "a"
            }, {
                id: 2,
                message: "b"
            }),
            mockEntireSchema: false,
            formatError: (err) => {
                console.log(err.stack);
                return err
            }
        });

        const {
            query
        } = createTestClient(server);

        const res = await query({
            query: GET_TODO,
            variables: {
                id: 1
            }
        });
        //console.log(res)
        expect(res.data.todo.message).toEqual("a");
    });

    it('gets the list of all Todos', async() => {

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: mocksds
            }),
            context: () => ({
                id: 1,
                message: "a"
            }, {
                id: 2,
                message: "b"
            }),
            mockEntireSchema: false,
            formatError: (err) => {
                console.log(err.stack);
                return err
            }
        });

        const {
            query
        } = createTestClient(server);

        const res = await query({
            query: GET_TODOS,
            variables: {  }
        });
        //console.log(res)
        expect(res.data.todos).toEqual(mok);
    });
});


//##########################################################################

describe('Test todo mutations', () => {
    it('adds a todo', async() => {

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: mocksds
            }),
            context: () => ({
                id: 1,
                message: "a"
            }, {
                id: 2,
                message: "b"
            }),
            mockEntireSchema: false,
            formatError: (err) => {
                console.log(err.stack);
                return err
            }
        });

        const {
            query
        } = createTestClient(server);


        const addresult = await query({
            query: ADD_TODO,
            variables: { id: 4 , newMessage: "newentry" }
        });

        //console.log(addresult)
        
        const res = await query({
            query: GET_TODO,
            variables: {
                id: 4
            }
        });
        //console.log(res)
        expect(res.data.todo.message).toEqual("newentry");
    });

    it('updates a todo', async() => {

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: mocksds
            }),
            context: () => ({
                id: 1,
                message: "a"
            }, {
                id: 2,
                message: "b"
            }),
            mockEntireSchema: false,
            formatError: (err) => {
                console.log(err.stack);
                return err
            }
        });

        const {
            query
        } = createTestClient(server);

        const updateresult = await query({
            query: UPDATE_TODO,
            variables: { id: 2 , updateMessage: "newmessage" }
        });

        //console.log(updateresult)

        const res = await query({
            query: GET_TODO,
            variables: { id: 2}
        });

        
        //console.log(res)
        expect(res.data.todo.message).toEqual("newmessage");
    });

it('deletes a todo', async() => {

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: mocksds
            }),
            context: () => ({
                id: 1,
                message: "a"
            }, {
                id: 2,
                message: "b"
            }),
            mockEntireSchema: false,
            formatError: (err) => {
                console.log(err.stack);
                return err
            }
        });

        const {
            query
        } = createTestClient(server);



        const addresult = await query({
            query: ADD_TODO,
            variables: { id: 6 , newMessage: "newentry" }
        });

        const delresult = await query({
            query: DELETE_TODO,
            variables: {
                id: 6
            }
        });

        const res = await query({
            query: GET_TODOS,
            variables: { }
        });
        //console.log(res)
        expect(res.data.todos).toEqual(mok);
    });


});





