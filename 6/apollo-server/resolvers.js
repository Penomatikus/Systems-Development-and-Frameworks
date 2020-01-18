import GraphQLJSON from 'graphql-type-json'
import { decodeJwt, createJwt } from './utils/jwtCreator'
import { ds } from './utils/TodoNeo4JAPI'



export default {
    JSON: GraphQLJSON,

    Query: {
        todos: async (root, { FILTER_MODE, skip, limit }, { dataSources }) => {
            let todos = await dataSources.ds.getAllTodos(
                FILTER_MODE,
                skip,
                limit
            )
            return todos
        },
        todosForUser: async (root, { username, token }, { dataSources }) => {
            const user = await dataSources.ds.getUser(username)
            if (decodeJwt(token, user.pw)) {
                return dataSources.ds.getTodosForUser(username)
            }
            return [{ message: 'SECRET NOT VALID' }]
        },
        todo: async (root, { id }, { dataSources }) => {
            let debugtodo = await dataSources.ds.findTodo(id)
            return debugtodo
        },
        getToDoDependencies: async (
            root,
            { id},
            { dataSources }
        ) => {
            return await dataSources.ds.getToDoDependencies(id)
        },
    },

    Mutation: {
        addTodo: async (
            root,
            { id, newMessage, loginData, lastEdited },
            { dataSources }
        ) => {
            const todo = {
                id: id,
                message: newMessage,
            }
            const user = await dataSources.ds.getUser(loginData.username)
            if (decodeJwt(loginData.token, user.pw)) {
                await dataSources.ds.addTodo(todo, loginData.username, lastEdited)
                return todo
            }
            console.log("permission denied")
            return undefined
        },
        authenticate: async (
            root,
            { Credentials },
            { dataSources }
        ) => {
            console.log("Before JWT Token")
            const user = await dataSources.ds.getUser(Credentials.username)
            console.log("JWT user:" + user)
            console.log("JWT pw:" + Credentials.pw)
            if (dataSources.ds.userExists(Credentials.username) == false || user.pw != Credentials.pw){
                console.log("permission denied")
                return ""
            }
            
            const token = createJwt(Credentials.pw)
            console.log("nice Hello")
            return token
         },
        updateTodo: async (root, { id, updateMessage, loginData, lastEdited }, { dataSources }) => {
            console.log("Update Todo")
            await dataSources.ds.updateTodo(id, updateMessage, lastEdited)

            return `todo with ID: ${id} was updated to ${updateMessage}`
        },

        addToDoDependency: async (
            root,
            { id, dependencyId },
            { dataSources }
        ) => {
            await dataSources.ds.addToDoDependency(id, dependencyId)
        },

        deleteTodo: (root, { id }, { dataSources }) => {
            dataSources.ds.deleteTodo(id)
            return `todo with ID ${id} was deleted`
        },
    },
}
