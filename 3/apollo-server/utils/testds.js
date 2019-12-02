const { DataSource } = require('apollo-datasource');

function searchelement(mok, id){
for (var i=0;i<mok.length;i++) {
  if (mok[i].id == id) 
  {
    return mok[i]
  }
}
return "findTodo: element not found"
}

function filterTodos(mok, userAuth) {
  var retArray = [];

  for (var i=0;i<mok.length;i++) {
    if (mok[i].userAuth == userAuth) 
    {      
      retArray.push(mok[i])
    }
  }

  if(retArray.length == 0)
    console.log("no valid todos found for user")
  return retArray
}

export class TodoAPI extends DataSource {
  
  constructor( store ) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }
  
  findTodo(id, userAuth) {
    return searchelement(this.store, id, userAuth)
  }

  getAllTodos() {
    return this.store;
  }

  getTodosForUser(userAuth) {
    return filterTodos(this.store, userAuth);
  }

  deleteTodo(id) {
   return this.store.splice( this.store.indexOf({id: id}), 1 );
  }

  addTodo(todo, userAuth) {
   return this.store.push({id: todo.id, message: todo.message, userAuth: userAuth})
  }

  updateTodo(id, newmessage){
   var tmp = this.findTodo(id);
   if (tmp == undefined){return undefined}
   tmp.message = newmessage;
   return tmp
  }

}

export const ds = new TodoAPI()

