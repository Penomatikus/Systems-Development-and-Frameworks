import GraphQLJSON from 'graphql-type-json'
import { decodeJwt } from './utils/jwtCreator'



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
        todosForUser: (root, { userAuth }, { dataSources }) => {
            if (decodeJwt(userAuth, 'secret')) {
                return dataSources.ds.getTodosForUser(userAuth)
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
            { id, newMessage, userAuth, lastEdited },
            { dataSources }
        ) => {
            const todo = {
                id: id,
                message: newMessage,
            }

            if (decodeJwt(userAuth, 'secret')) {
                await dataSources.ds.addTodo(todo, userAuth, lastEdited)
                return todo
            }

            return undefined
        },

        updateTodo: async (root, { id, updateMessage, userAuth, lastEdited }, { dataSources }) => {
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
