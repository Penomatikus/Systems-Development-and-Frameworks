import gql from 'graphql-tag'

export const ADD_TODO = gql`
    mutation addTodo($id: Int!, $newMessage: String!, $loginData: LoginData!, $lastEdited: String!) {
        addTodo(id: $id, newMessage: $newMessage, loginData: $loginData, lastEdited: $lastEdited) {
            id
            message
            username
            lastEdited
        }
    }
`

export const UPDATE_TODO = gql`
    mutation updateTodo(
        $id: Int!
        $updateMessage: String!
        $loginData: LoginData!
        $lastEdited: String!
    ) {
        updateTodo(id: $id, updateMessage: $updateMessage, loginData: $loginData, lastEdited: $lastEdited)
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
    mutation deleteTodo($id: Int!, $loginData: LoginData!) {
        deleteTodo(id: $id, loginData: $loginData)
    }
`

export const GET_TODO = gql`
    query todo($id: Int!) {
        todo(id: $id) {
            id
            message
            username
            lastEdited
        }
    }
`

export const GET_TODOS = gql`
    query todos($FILTER_MODE: String!, $skip: Int, $limit: Int) {
        todos(FILTER_MODE: $FILTER_MODE, skip: $skip, limit: $limit) {
            id
            message
            username
            lastEdited
        }
    }
`

export const AUTHENTICATE = gql`
    mutation authenticate($Credentials: Credentials!) {
        authenticate(Credentials: $Credentials)
    }
`