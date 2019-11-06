<template>
  <div id="app">
    <list
      v-bind:todos="todos"
      @update-todo="updateTodo"
      @delete-todo="deleteTodo"
    ></list>
    <button v-on:click="newTodo" type="button">
      Add todo
    </button>
  </div>
</template>

<script>
import List from "./components/List.vue";

export default {
  name: "app",
  components: {
    List
  },
  data: () => {
   return {
    lastId: 3,
    todos:  [
      { id: '1', message: 'Foo', },
      { id: '2', message: 'Bar', },
      { id: '3', message: 'Baz', }
    ]}
  },
   methods: {
    newTodo: function() {      
      this.lastId++
      this.todos.push({id : this.lastId, message: ""})
      // console.log("New Todo: [" + this.lastId + "]")     
    },
    updateTodo: function(passedTodo) {
        // console.log("(Großeltern) \nIch erhielt die todo [" + passedTodo.id + " | " + passedTodo.message + "] via $emit ")
        // console.log("(Großeltern) \nFinde den entsprechenden index passend zur ID(" + passedTodo.id +") in todos[]")
        let index = this.todos.findIndex( todo => todo.id == passedTodo.id)
        // console.log("(Großeltern) \nUpdate das entsprechend gefundene Objekt in todos[]")
        this.todos[index] = passedTodo   
        // console.log("(Großeltern)\nTodo wurde geupdated: [" + this.todos[index].id + " | " + this.todos[index].message +"]")     
      },  
    deleteTodo: function(id) {
        // console.log("(Großeltern) Finde den entsprechenden index passend zur ID(" + id +") in todos[]")'
        let index = this.todos.findIndex( todo => todo.id == id)
        this.$delete(this.todos, index)
        // console.log("(Großeltern)\nIch habe das Todo mit der folgenden ID gelöscht: " + id)
    }

}};
</script>
