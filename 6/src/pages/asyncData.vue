<template>
    <div>
        <div v-for="todo in allPosts" :key="todo.id">{{ todo.id }}</div>
        <div>hallo</div>
    </div>
</template>

<script>
import gql from 'graphql-tag'


console.log("hallo")

export default {
    head () {
        return {
            title: 'asyncData'
        }
    },
    data () {
        return {
            allPosts: []
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
        return {allPosts:querydata}
    }
}
</script>
