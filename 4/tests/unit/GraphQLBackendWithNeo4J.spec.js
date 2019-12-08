import fs from 'fs'
import path from 'path'
import resolvers from '../../apollo-server/resolvers'

import { TodoNeo4JAPI } from '../../apollo-server/utils/testNeo4Jds'
import { createJwt, decodeJwt } from '../../apollo-server/utils/jwtCreator'

var neo4j = require('neo4j-driver')

const { ApolloServer, gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');

const typeDefs = fs.readFileSync(path.resolve(__dirname, '../../apollo-server/schema.graphql'), { encoding: 'utf8' })

const ADD_TODO = gql `
mutation addTodo($id: Int!, $newMessage: String!, $userAuth: String!){
  addTodo(
    id: $id
    newMessage: $newMessage
    userAuth: $userAuth
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

const GET_TODOS_FOR_USER = gql `
    query todosForUser($userAuth: String!){
        todosForUser(userAuth: $userAuth)   {
          id
          message 
        }
        }
`;

//##########################################################################

async function addstuff(query, testUser) {

for (let i = 0; i<5;i++){
const addresult = await query({
            query: ADD_TODO,
            variables: { id: i , newMessage: "newentry"+i, userAuth: testUser}
        });

}
}

var driver = neo4j.driver(
            'bolt://localhost:7687',
            neo4j.auth.basic('neo4j', 'ggs')
        ) 
 
        const serverds = new TodoNeo4JAPI(driver);
     

describe('Test todo with Database interactions', () => {
    it('adds a todo and tries to retrieve it', async() => {
        
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: serverds
            }),
            mockEntireSchema: false,
            formatError: (err) => {
                console.log(err);
                return err
            }
        });

        const {
            query
        } = createTestClient(server);

        let testUser = createJwt("secret")

        const addresult = await query({
            query: ADD_TODO,
            variables: { id: 10 , newMessage: "newentry", userAuth: testUser}
        });

        //console.log(addresult)
        
        const res = await query({
            query: GET_TODO,
            variables: {
                id: 10
            }
        });
        //console.log(server)
        expect(res.data.todo.message).toEqual("newentry");
        await serverds.deleteAll();
        
    });

    it('updates a todo', async() => {

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            ds: serverds
        }),
        mockEntireSchema: false,
        formatError: (err) => {
            console.log(err);
            return err
        }
    });

        const {
            query
        } = createTestClient(server);

        let testUser = createJwt("secret")

        await addstuff(query, testUser);

        const updateresult = await query({
            query: UPDATE_TODO,
            variables: { id: 2 , updateMessage: "newmessage" }
        });

        //console.log(updateresult)

        const res = await query({
            query: GET_TODO,
            variables: { id: 2}
        })

        //console.log(res)
        expect(res.data.todo.message).toEqual("newmessage");
        //await serverds.deleteAll();

	
    });
//
//it('deletes a todo', async() => {
//
//    var tmpMock = []
//
//        const server = new ApolloServer({
//            typeDefs,
//            resolvers,
//            dataSources: () => ({
//                ds: new TodoAPI(tmpMock)
//            }),
//            mockEntireSchema: false,
//            formatError: (err) => {
//                console.log(err.stack);
//                return err
//            }
//        });
//
//        const {
//            query
//        } = createTestClient(server);
//
//        let testUser = createJwt("secret")
//
//        const addresult = await query({
//            query: ADD_TODO,
//            variables: { id: 6 , newMessage: "newentry", userAuth: testUser }
//        });
//
//        const delresult = await query({
//            query: DELETE_TODO,
//            variables: {
//                id: 6
//            }
//        });
//
//        const res = await query({
//            query: GET_TODOS,
//            variables: { }
//        });
//        //console.log(res)
//        expect(res.data.todos).toEqual(MOCK_UP_TEST_RESULTS);
//    });


});




