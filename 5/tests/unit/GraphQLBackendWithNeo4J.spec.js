import {
    FILTER_MODE,
    TodoNeo4JAPI,
} from '../../apollo-server/utils/TodoNeo4JAPI'

import { createJwt } from '../../apollo-server/utils/jwtCreator'
import fs from 'fs'
import path from 'path'
import resolvers from '../../apollo-server/resolvers'

import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'
import { rule, shield, and, or, not } from 'graphql-shield'


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
    mutation updateTodo($id: Int!, $updateMessage: String!, $userAuth: String!) {
        updateTodo(id: $id, updateMessage: $updateMessage, userAuth: $userAuth)
    }
`

const ADD_DEPENDENCY = gql`
    mutation addToDoDependency($id: Int!, $dependencyId: Int!) {
        addToDoDependency(id: $id, dependencyId: $dependencyId)
    }
`

const GET_DEPENDENCIES = gql`
    query getToDoDependencies($id: Int!) {
        getToDoDependencies(id: $id){
            id
            message
        }
    }
`

const DELETE_TODO = gql`
    mutation deleteTodo($id: Int!, $userAuth: String!) {
        deleteTodo(id: $id, userAuth: $userAuth)
    }
`

const GET_TODO = gql`
    query todo($id: Int!) {
        todo(id: $id) {
            id
            message
        }
    }
`

const GET_TODOS = gql`
    query todos($FILTER_MODE: String!, $skip: Int!, $limit: Int!) {
        todos(FILTER_MODE: $FILTER_MODE, skip: $skip, limit: $limit) {
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
    return new neo4j.driver(
        'bolt://localhost:7687',
        neo4j.auth.basic('neo4j', 'ggs')
    )
}

function createNewServer(driver) {
    
    const schema = makeExecutableSchema({ typeDefs, resolvers })
    
    const isAuthenticated = rule({ cache: 'contextual' })(
        async (parent, args, ctx, info) => {
            const todo = await ctx.dataSources.ds.findTodo(args.id)
          return (typeof todo !=='undefined' && args.userAuth == todo.userAuth)
        },
      )

    const permissions = shield({
        Mutation: {
          updateTodo: isAuthenticated,
          deleteTodo: isAuthenticated,
          //addTodo: or (isAuthenticated, not (isAuthenticated))
        }
    })
    
    return new ApolloServer({
        //typeDefs,
        schema: schema,
        //resolvers,
        dataSources: () => ({
            ds: new TodoNeo4JAPI(driver),
        }),
        middlewares: applyMiddleware(schema, permissions),
        mockEntireSchema: false,
        formatError: err => {
            console.log(err)
            return err
        },
    })
}

async function addMultipleTodos(times, testClientQuery, jwtToken) {
    for (let i = 0; i < times; i++) {
        await testClientQuery({
            query: ADD_TODO,
            variables: {
                id: i,
                newMessage: 'newentry' + i,
                userAuth: jwtToken,
            },
        })
    }
}

//##########################################################################

beforeEach(async () => {
    await new TodoNeo4JAPI(createNewDriver()).deleteAll()
})

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
    })

    it('updates a todo', async () => {
        const driver = createNewDriver()
        const server = createNewServer(driver)
        const { query } = createTestClient(server)
        const testUser = createJwt('secret')

        await addMultipleTodos(5, query, testUser)
        await query({
            query: UPDATE_TODO,
            variables: { id: 2, updateMessage: 'newmessage', userAuth: testUser },
        })

        const res = await query({
            query: GET_TODO,
            variables: { id: 2 },
        })

        expect(res.data.todo.message).toEqual('newmessage')
    })

    it('adds dependencies to a ToDo', async () => {
        const driver = createNewDriver()
        const server = createNewServer(driver)
        const { query } = createTestClient(server)
        const testUser = createJwt('secret')

        await addMultipleTodos(3, query, testUser)
        await query({
            query: ADD_DEPENDENCY,
            variables: { id: 0, dependencyId: 1 },
        })
        await query({
            query: ADD_DEPENDENCY,
            variables: { id: 0, dependencyId: 2 },
        })

        const res = await query({
            query: GET_DEPENDENCIES,
            variables: { id: 0 },
        })

        expect(res.data.getToDoDependencies.length).toEqual(2)
    })

    it('gets all todos in the DB ordered by ascending IDs', async () => {
        const driver = createNewDriver()
        const server = createNewServer(driver)
        const { query } = createTestClient(server)
        let testUser = createJwt('secret')

        await addMultipleTodos(25, query, testUser)

        const res = await query({
            query: GET_TODOS,
            variables: {
                FILTER_MODE: FILTER_MODE.ASC,
                skip: -1,
                limit: -1,
            },
        })
        let todos = res.data.todos

        for (let i = 0; i < todos.length - 1; i++) {
            expect(todos[i].id <= todos[i + 1].id).toEqual(true)
        }
    })

    it('gets all todos in the DB ordered by ascending IDs with paging', async () => {
        const driver = createNewDriver()
        const server = createNewServer(driver)
        const { query } = createTestClient(server)
        let testUser = createJwt('secret')

        await addMultipleTodos(25, query, testUser)

        const res = await query({
            query: GET_TODOS,
            variables: {
                FILTER_MODE: FILTER_MODE.ASC,
                skip: 1,
                limit: 10,
            },
        })
        let todos = res.data.todos

        expect(todos.length).toEqual(10)
        
        for (let i = 0; i < todos.length - 1; i++) {
            expect(todos[i].id <= todos[i + 1].id).toEqual(true)
        }
    })

    it('deletes a todo', async () => {
        const driver = createNewDriver()
        const server = createNewServer(driver)
        const { query } = createTestClient(server)
        const testUser = createJwt('secret')

        let toBeDeleted = [
            { id: 9999, newMessage: 'newentry', userAuth: testUser },
        ]

        await query({
            query: ADD_TODO,
            variables: toBeDeleted[0],
        })

        await query({
            query: DELETE_TODO,
            variables: {
                id: 9999,
                userAuth: testUser
            },
        })

        const res = await query({
            query: GET_TODOS,
            variables: {
                FILTER_MODE: FILTER_MODE.NONE,
                skip: -1,
                limit: -1,
            },
        })

        //https://jestjs.io/docs/en/expect#expectarraycontainingarray
        expect(res.data.todos).not.toEqual(expect.arrayContaining(toBeDeleted))
    })
})
