const { DataSource } = require('apollo-datasource');

function searchelement(mok,id){
for (var i=0;i<mok.length;i++) {
  if (mok[i].id == id) 
  {
    return mok[i]
  }
}
return undefined
}

export class TodoAPI extends DataSource {
  
  constructor( store ) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }
  
  findTodo(id) {
    return searchelement(this.store, id)
  }

  getTodos() {
   return this.store
  }

  deleteTodo(id) {
   return this.store.splice( this.store.indexOf({id: id}), 1 );
  }

  addTodo(todo) {
   return this.store.push(todo)
  }

  updateTodo(id, newmessage){
   var tmp = findTodo(id);
   if (tmp == undefined){return undefined}
   tmp.message = newmessage;
   return tmp
  }


}

export const ds = new TodoAPI()

