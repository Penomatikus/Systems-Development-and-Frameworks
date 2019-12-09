import { TodoNeo4JAPI } from '../../apollo-server/utils/testNeo4Jds'
import { createJwt } from '../../apollo-server/utils/jwtCreator'
import fs from 'fs'
import path from 'path'
import resolvers from '../../apollo-server/resolvers'

var neo4j = require('neo4j-driver')
const { ApolloServer, gql } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')

const typeDefs = fs.readFileSync(
    path.resolve(__dirname, '../../apollo-server/schema.graphql'),
    { encoding: 'utf8' }
)

const ADD_TODO = gql`
    mutation addTodo($id: Int!, $newMessage: String!, $userAuth: String!) {
        addTodo(id: $id, newMessage: $newMessage, userAuth: $userAuth) {
            id
            message
        }
    }
`

const UPDATE_TODO = gql`
    mutation updateTodo($id: Int!, $updateMessage: String!) {
        updateTodo(id: $id, updateMessage: $updateMessage)
    }
`

// const DELETE_TODO = gql`
//   mutation deleteTodo($id: Int!) {
//     deleteTodo(id: $id)
//   }
// `;

const GET_TODO = gql`
    query todo($id: Int!) {
        todo(id: $id) {
            id
            message
        }
    }
`

const GET_TODOS = gql`
    {
        todos {
            id
            message
        }
    }
`

// const GET_TODOS_FOR_USER = gql`
//   query todosForUser($userAuth: String!) {
//     todosForUser(userAuth: $userAuth) {
//       id
//       message
//     }
//   }
// `;

function createNewDriver() {
    return neo4j.driver(
        'bolt://localhost:7687',
        neo4j.auth.basic('neo4j', '123456789')
    )
}

function createNewServer(driver) {
    return new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            ds: new TodoNeo4JAPI(driver),
        }),
        mockEntireSchema: false,
        formatError: err => {
            console.log(err)
            return err
        },
    })
}

// No need to make IDs unique here, since testing (ID-Range 0-1000)
async function addMultipleTodos(times, testClientQuery, jwtToken) {
    for (let i = 0; i < times; i++) {
        await testClientQuery({
            query: ADD_TODO,
            variables: {
                id: Math.floor(Math.random() * 1000),
                newMessage: 'newentry',
                userAuth: jwtToken,
            },
        })
    }
}

//##########################################################################

describe('Test todo with Neo4J Database interactions', () => {
    it('adds a todo and tries to retrieve it', async () => {
        const driver = createNewDriver()
        const server = createNewServer(driver)
        const { query } = createTestClient(server)
        const testUser = createJwt('secret')

        await query({
            query: ADD_TODO,
            variables: { id: 10, newMessage: 'newentry', userAuth: testUser },
        })

        const res = await query({
            query: GET_TODO,
            variables: {
                id: 10,
            },
        })

        expect(res.data.todo.message).toEqual('newentry')

        await driver.close()
    })

    it('updates a todo', async () => {
        const driver = createNewDriver()
        const server = createNewServer(driver)
        const { query } = createTestClient(server)
        let testUser = createJwt('secret')

        await query({
            query: ADD_TODO,
            variables: {
                id: 2,
                newMessage: 'TO_BE_UPDATED_TODO',
                userAuth: testUser,
            },
        })

        await query({
            query: UPDATE_TODO,
            variables: { id: 2, updateMessage: 'newmessage' },
        })

        const res = await query({
            query: GET_TODO,
            variables: { id: 2 },
        })

        expect(res.data.todo.message).toEqual('newmessage')
    })
    it('gets all todos in the DB ordered by ascending IDs', async () => {
        const driver = createNewDriver()
        const server = createNewServer(driver)
        const { query } = createTestClient(server)
        let testUser = createJwt('secret')

        addMultipleTodos(25, query, testUser)
    })
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
})
