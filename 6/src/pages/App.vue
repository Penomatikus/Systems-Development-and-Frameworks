<template>
    <div id="app">
        <div v-if="isLoggedIn == true">
            <p>Username:</p>
            <input type="text" v-model="credentials.username" id="userMock" value="userMock" />
            <br />
            <br />
            <list v-bind:todos="todos" @update-todo="updateTodo" @delete-todo="deleteTodo"></list>
            <button v-on:click="newTodo" type="button">Add todo</button>
        </div>
       <div v-else>
           <input type="text" v-model="credentials.username" id="login" value="" />
           <input type="password" v-model="credentials.pw" id="login" value="" />
           <button v-on:click="onSubmit()" type="button" id="login">Login</button>
       </div>
    </div>
</template>

<script>
import List from '../components/List.vue'
import { createJwt } from '../../apollo-server/utils/jwtCreator'

import {
    ADD_TODO,
    UPDATE_TODO,
    ADD_DEPENDENCY,
    GET_DEPENDENCIES,
    DELETE_TODO,
    GET_TODO,
    GET_TODOS,
    AUTHENTICATE,
} from '../../apollo-server/graphqlRequests'

export default {
    name: 'app',
    components: {
        List,
    },
    data: () => {
        return {
            credentials: {
            username: 'anon',
            pw: '1234'
            },
            isLoggedIn: false,
            lastId: 3,
            todos: [
                {
                    id: '1',
                    message: 'Foo',
                    username: 'fakeUser_1',
                    lastEdited: 'autogen.',
                },
                {
                    id: '2',
                    message: 'Bar',
                    username: 'fakeUser_2',
                    lastEdited: 'autogen.',
                },
                {
                    id: '3',
                    message: 'Baz',
                    username: 'fakeUser_3',
                    lastEdited: 'autogen.',
                },
            ],
        }
    },
    async asyncData (context) {
        let client = context.app.apolloProvider.defaultClient
        let querydata = {}
        await client.query({
            query: GET_TODOS,
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
        async onSubmit () {
            console.log("In OnSubmit")
        const credentials = this.credentials
        try {
        const res = await this.$apollo.mutate({
            mutation: AUTHENTICATE,
            variables: {Credentials: this.credentials}
        }).then(({data}) => data )
        console.log("res: " + res.authenticate)
        if (res.authenticate === "" || !res.authenticate){
            console.error("auth failed: no valid token")
            this.$nuxt.error({statusCode:403, message:'403: You are not allowed to see this'})
            return
        }
        await this.$apolloHelpers.onLogin(res.authenticate)
         this.isLoggedIn = true
         } catch (e) {
            this.$nuxt.error({statusCode:403, message:'403: You are not allowed to see this'})
        }
        },
        newTodo: async function() {
          const testUser = createJwt('secret')
          const client = this.$apollo.getClient()
          await this.$apollo.mutate({
              mutation: ADD_TODO,
          variables: {
              id: this.lastId,
              newMessage: 'new todo',
              loginData: {username: this.credentials.username, token: this.$apolloHelpers.getToken()},
              lastEdited: new Date().toLocaleString(),
              },
          })
          console.log("in newTODO: ")

            //console.log(this.username)
            this.lastId++
            //this.todos.push({
            //    id: this.lastId,
            //    message: 'new todo',
            //    user: this.username,
            //    lastEdited: new Date().toLocaleString(),
            //})
            // console.log("New Todo: [" + this.lastId + "]")
        },
        async updateTodo(passedTodo) {
            console.log("in updateTODO: ")
            const client = this.$apollo.getClient()
            await this.$apollo.mutate({
                mutation: UPDATE_TODO,
            variables: {
              id: passedTodo.id,
              updateMessage: passedTodo.message,
              loginData: {username: this.credentials.username, token: this.$apolloHelpers.getToken()},
              lastEdited: new Date().toLocaleString()
                },
            })
            // console.log("(Großeltern) \nIch erhielt die todo [" + passedTodo.id + " | " + passedTodo.message + "] via $emit ")
            // console.log("(Großeltern) \nFinde den entsprechenden index passend zur ID(" + passedTodo.id +") in todos[]")
            //let index = this.todos.findIndex(todo => todo.id == passedTodo.id)
            // console.log("(Großeltern) \nUpdate das entsprechend gefundene Objekt in todos[]")
            //this.todos[index] = passedTodo
            //this.todos[index].lastEdited = new Date().toLocaleString()
            // console.log("(Großeltern)\nTodo wurde geupdated: [" + this.todos[index].id + " | " + this.todos[index].message +"]")
        },
        deleteTodo: async function(id) {
            const client = this.$apollo.getClient()
            await this.$apollo.mutate({
                mutation: DELETE_TODO,
                variables: {
                id: id,
                loginData: {username: this.credentials.username, token: this.$apolloHelpers.getToken()}
                },
            })
            // console.log("(Großeltern) Finde den entsprechenden index passend zur ID(" + id +") in todos[]")'
            //let index = this.todos.findIndex(todo => todo.id == id)
            //this.$delete(this.todos, index)
            // console.log("(Großeltern)\nIch habe das Todo mit der folgenden ID gelöscht: " + id)
        },
    },
}
</script>
