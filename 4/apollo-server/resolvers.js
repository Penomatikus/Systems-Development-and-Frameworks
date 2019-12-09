import GraphQLJSON from 'graphql-type-json'
import { decodeJwt } from './utils/jwtCreator'

export default {
    JSON: GraphQLJSON,

    Query: {
        todos: async (root, { FILTER_MODE }, { dataSources }) => {
            let todos = await dataSources.ds.getAllTodos(FILTER_MODE)
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
    },

    Mutation: {
        addTodo: async (
            root,
            { id, newMessage, userAuth },
            { dataSources }
        ) => {
            const todo = {
                id: id,
                message: newMessage,
            }

            if (decodeJwt(userAuth, 'secret')) {
                await dataSources.ds.addTodo(todo, userAuth)
                return todo
            }

            return undefined
        },

        updateTodo: async (root, { id, updateMessage }, { dataSources }) => {
            await dataSources.ds.updateTodo(id, updateMessage)

            return `todo with ID: ${id} was updated to ${updateMessage}`
        },

        deleteTodo: (root, { id }, { dataSources }) => {
            dataSources.ds.deleteTodo(id)
            return `todo with ID ${id} was deleted`
        },
    },
}
