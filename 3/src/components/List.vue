<template>
     <div id="list">
       <list-item 
                v-for="todo in todos"            
                :key="todo.id"
                :todo="todo"
                @update-todo="updateTodo"
                @delete-todo="deleteTodo">
        </list-item>
      </div>
</template>

<script>
import ListItem from "./ListItem.vue";
export default
{   name: 'list',
    props: ['todos'],
    components: {
        ListItem
    },
    methods: {
        updateTodo: function(passedTodo) {
            this.$emit('update-todo', passedTodo)
        },  
        deleteTodo: function(id) {
            this.$emit('delete-todo', id)
        }
    }
};
</script>
