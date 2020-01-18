import gql from 'graphql-tag'

export const ADD_TODO = gql`
    mutation addTodo($id: Int!, $newMessage: String!, $userAuth: String!, $lastEdited: String!) {
        addTodo(id: $id, newMessage: $newMessage, userAuth: $userAuth, lastEdited: $lastEdited) {
            id
            message
            userAuth
            lastEdited
        }
    }
`

export const UPDATE_TODO = gql`
    mutation updateTodo(
        $id: Int!
        $updateMessage: String!
        $userAuth: String!
        $lastEdited: String!
    ) {
        updateTodo(id: $id, updateMessage: $updateMessage, userAuth: $userAuth, lastEdited: $lastEdited)
    }
`

export const ADD_DEPENDENCY = gql`
    mutation addToDoDependency($id: Int!, $dependencyId: Int!) {
        addToDoDependency(id: $id, dependencyId: $dependencyId)
    }
`

export const GET_DEPENDENCIES = gql`
    query getToDoDependencies($id: Int!) {
        getToDoDependencies(id: $id) {
            id
            message
        }
    }
`

export const DELETE_TODO = gql`
    mutation deleteTodo($id: Int!, $userAuth: String!) {
        deleteTodo(id: $id, userAuth: $userAuth)
    }
`

export const GET_TODO = gql`
    query todo($id: Int!) {
        todo(id: $id) {
            id
            message
            userAuth
            lastEdited
        }
    }
`

export const GET_TODOS = gql`
    query todos($FILTER_MODE: String!, $skip: Int!, $limit: Int!) {
        todos(FILTER_MODE: $FILTER_MODE, skip: $skip, limit: $limit) {
            id
            message
            userAuth
            lastEdited
        }
    }
`
