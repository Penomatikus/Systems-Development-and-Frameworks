<template>
    <div id="app">
        <p>Username:</p>
        <input type="text" v-model="username" id="userMock" value="userMock" />
        <br />
        <br />
        <list v-bind:todos="todos" @update-todo="updateTodo" @delete-todo="deleteTodo"></list>
        <button v-on:click="newTodo" type="button">Add todo</button>
    </div>
</template>

<script>
import List from '../components/List.vue'
import gql from 'graphql-tag'

export default {
    name: 'app',
    components: {
        List,
    },
    data: () => {
        return {
            username: 'dummy',
            lastId: 3,
            todos: [
                {
                    id: '1',
                    message: 'Foo',
                    user: 'fakeUser_1',
                    lastEdited: 'autogen.',
                },
                {
                    id: '2',
                    message: 'Bar',
                    user: 'fakeUser_2',
                    lastEdited: 'autogen.',
                },
                {
                    id: '3',
                    message: 'Baz',
                    user: 'fakeUser_3',
                    lastEdited: 'autogen.',
                },
            ],
        }
    },
    async asyncData (context) {
        let client = context.app.apolloProvider.defaultClient
        let querydata = {}
        await client.query({
            query: gql`
            query todos($FILTER_MODE: String!, $skip: Int, $limit: Int) {
            todos(FILTER_MODE: $FILTER_MODE, skip: $skip, limit: $limit) {
            id
            message
            userAuth
            lastEdited
        }
    }`,
    variables: {
                FILTER_MODE: "asc",
                limit: 10,
            },
        }).then(
            ( qresult ) => {
               querydata = qresult.data.todos
            }
        )
        console.log("vor return: " + querydata)
        return {todos:querydata}
    },
    methods: {
        newTodo: function() {
            console.log(this.username)
            this.lastId++
            this.todos.push({
                id: this.lastId,
                message: 'new todo',
                user: this.username,
                lastEdited: new Date().toLocaleString(),
            })
            // console.log("New Todo: [" + this.lastId + "]")
        },
        updateTodo: function(passedTodo) {
            // console.log("(Großeltern) \nIch erhielt die todo [" + passedTodo.id + " | " + passedTodo.message + "] via $emit ")
            // console.log("(Großeltern) \nFinde den entsprechenden index passend zur ID(" + passedTodo.id +") in todos[]")
            let index = this.todos.findIndex(todo => todo.id == passedTodo.id)
            // console.log("(Großeltern) \nUpdate das entsprechend gefundene Objekt in todos[]")
            this.todos[index] = passedTodo
            this.todos[index].lastEdited = new Date().toLocaleString()
            // console.log("(Großeltern)\nTodo wurde geupdated: [" + this.todos[index].id + " | " + this.todos[index].message +"]")
        },
        deleteTodo: function(id) {
            // console.log("(Großeltern) Finde den entsprechenden index passend zur ID(" + id +") in todos[]")'
            let index = this.todos.findIndex(todo => todo.id == id)
            this.$delete(this.todos, index)
            // console.log("(Großeltern)\nIch habe das Todo mit der folgenden ID gelöscht: " + id)
        },
    },
}
</script>
