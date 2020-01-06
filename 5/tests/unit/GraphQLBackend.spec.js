import {
    MOCK_UP_DATASOURCE_CONTENT,
    MOCK_UP_TEST_RESULTS,
} from '../../apollo-server/utils/mockUpDs'
import { createJwt, decodeJwt } from '../../apollo-server/utils/jwtCreator'

import { FILTER_MODE } from '../../apollo-server/utils/TodoNeo4JAPI'
import { TodoAPI } from '../../apollo-server/utils/testds'
import fs from 'fs'
import path from 'path'
import resolvers from '../../apollo-server/resolvers'

const { ApolloServer, gql } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')

const typeDefs = fs.readFileSync(
    path.resolve(__dirname, '../../apollo-server/schema.graphql'),
    { encoding: 'utf8' }
)
var mok = MOCK_UP_DATASOURCE_CONTENT

const ADD_TODO = gql`
    mutation addTodo($id: Int!, $newMessage: String!, $userAuth: String!, $lastEdited: String!) {
        addTodo(id: $id, newMessage: $newMessage, userAuth: $userAuth, lastEdited: $lastEdited) {
            id
            message
            userAuth
            lastEdited
        }
    }
`

const UPDATE_TODO = gql`
    mutation updateTodo($id: Int!, $updateMessage: String!, $userAuth: String!, $lastEdited: String!) {
        updateTodo(id: $id, updateMessage: $updateMessage, userAuth: $userAuth, lastEdited: $lastEdited)
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
            userAuth
            lastEdited
        }
    }
`
const GET_TODOS = gql`
    query todos($FILTER_MODE: String!) {
        todos(FILTER_MODE: $FILTER_MODE) {
            id
            message
            userAuth
            lastEdited
        }
    }
`

const GET_TODOS_FOR_USER = gql`
    query todosForUser($userAuth: String!) {
        todosForUser(userAuth: $userAuth) {
            id
            message
            userAuth
            lastEdited
        }
    }
`

//actual Test
describe('Jwt creation test', () => {
    it('should create a jwt token', () => {
        let token = createJwt('stuff')
        expect(token).not.toBe(undefined)
        expect(token).not.toBe('')
    })
    it('should decode a jwt token', () => {
        let token = createJwt('testSecret')
        expect(decodeJwt(token, 'testSecret')).toBe(true)
    })
})

describe('Test Todo query', () => {
    it('finds a todo by id', async () => {
        var tmpMock = MOCK_UP_DATASOURCE_CONTENT.slice(0)
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: new TodoAPI(tmpMock),
            }),
            mockEntireSchema: false,
            formatError: err => {
                console.log(err.stack)
                return err
            },
        })

        const { query } = createTestClient(server)

        const res = await query({
            query: GET_TODO,
            variables: {
                id: 1,
            },
        })
        //console.log(res)
        expect(res.data.todo.message).toEqual('a')
    })

    it('gets the list of all Todos', async () => {
        var tmpMock = MOCK_UP_DATASOURCE_CONTENT.slice(0)
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: new TodoAPI(tmpMock),
            }),
            mockEntireSchema: false,
            formatError: err => {
                console.log(err.stack)
                return err
            },
        })

        const { query } = createTestClient(server)

        const res = await query({
            query: GET_TODOS,
            variables: {
                FILTER_MODE: FILTER_MODE.NONE,
            },
        })
        //console.log(res)
        expect(res.data.todos).toEqual(MOCK_UP_TEST_RESULTS)
    })
})

//##########################################################################

describe('Test todo mutations', () => {
    it('adds a todo', async () => {
        var tmpMock = MOCK_UP_DATASOURCE_CONTENT.slice(0)

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: new TodoAPI(tmpMock),
            }),
            mockEntireSchema: false,
            formatError: err => {
                console.log(err.stack)
                return err
            },
        })

        const { query } = createTestClient(server)

        let testUser = createJwt('secret')

        const addresult = await query({
            query: ADD_TODO,
            variables: { id: 10, newMessage: 'newentry', userAuth: testUser, lastEdited: new Date().toLocaleString()},
        })

        //console.log(addresult)

        const res = await query({
            query: GET_TODO,
            variables: {
                id: 10,
            },
        })
        //console.log(res)
        expect(res.data.todo.message).toEqual('newentry')
    })

    it('updates a todo', async () => {
        var tmpMock = [
            { id: 1, message: 'a', userAuth: '0' },
            { id: 2, message: 'b', userAuth: '0' },
        ]

        let testUser = createJwt('secret')

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: new TodoAPI(tmpMock),
            }),
            mockEntireSchema: false,
            formatError: err => {
                console.log(err.stack)
                return err
            },
        })

        const { query } = createTestClient(server)

        const updateresult = await query({
            query: UPDATE_TODO,
            variables: { id: 2, updateMessage: 'newmessage', userAuth: testUser, lastEdited: new Date().toLocaleString() },
        })

        //console.log(updateresult)

        const res = await query({
            query: GET_TODO,
            variables: { id: 2 },
        })

        //console.log(res)
        expect(res.data.todo.message).toEqual('newmessage')
    })

    it('deletes a todo', async () => {
        var tmpMock = MOCK_UP_DATASOURCE_CONTENT.slice(0)

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: new TodoAPI(tmpMock),
            }),
            mockEntireSchema: false,
            formatError: err => {
                console.log(err.stack)
                return err
            },
        })

        const { query } = createTestClient(server)

        let testUser = createJwt('secret')

        const addresult = await query({
            query: ADD_TODO,
            variables: { id: 6, newMessage: 'newentry', userAuth: testUser, lastEdited: new Date().toLocaleString() },
        })

        const delresult = await query({
            query: DELETE_TODO,
            variables: {
                id: 6,
                userAuth: testUser
            },
        })

        const res = await query({
            query: GET_TODOS,
            variables: {
                FILTER_MODE: FILTER_MODE.NONE,
            },
        })
        //console.log(res)
        expect(res.data.todos).toEqual(MOCK_UP_TEST_RESULTS)
    })
})

describe('JWT tests', () => {
    it('gets the list of all Todos for user', async () => {
        var tmpMock = []
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                ds: new TodoAPI(tmpMock),
            }),
            mockEntireSchema: false,
            formatError: err => {
                console.log(err.stack)
                return err
            },
        })

        const { query } = createTestClient(server)

        let testUser = createJwt('secret')
        let lastEditedtime = new Date().toLocaleString()

        const addresult = await query({
            query: ADD_TODO,
            variables: { id: 0, newMessage: 'bla', userAuth: testUser, lastEdited: lastEditedtime },
        })

        var result = [{ id: 0, message: 'bla',userAuth:testUser, lastEdited: lastEditedtime }]

        const res = await query({
            query: GET_TODOS_FOR_USER,
            variables: { userAuth: testUser },
        })
        //console.log(res)
        expect(res.data.todosForUser).toEqual(result)
    })
})
