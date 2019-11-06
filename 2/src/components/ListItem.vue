<template>
<div id="list-item">
<form id="test">
            <li v-if="editMode == true" >                
                <input type="text" placeholder="enter new value" v-on:input="updateMessage"> 
                <button v-on:click="saveMe(todo)" type="button">
                    Save
                </button>
                <button v-on:click="cancelMe" type="button">
                    Cancel
                </button>
            </li>
            <li v-else >                
                {{todo.id}}. {{todo.message}} 
                <button v-on:click="editMe" type="button">
                    Edit
                </button>
                <button v-on:click="deleteMe(todo)" type="button">
                    Delete
                </button>

            </li>
        </form>
</div>
</template>


<script>
export default 
{   name: 'list-item',
    props: ['todo'],
    data: () => {
        return {
            editMode: false,
            newMessage: ""
        }
    },
    methods: {
        editMe: function() {
            this.editMode = true;
        },
        saveMe: function(todo) { 
	    this.todo.message = this.newMessage
            this.$emit('update-todo', todo) 
            this.editMode = false
        },
        deleteMe: function(todo) {
            this.$emit('delete-todo', todo.id)
        },
        cancelMe: function() {
            this.editMode = false;
        },
        updateMessage: function(event) {
            this.newMessage =
                event.target.value
        }
    }
};

</script>
