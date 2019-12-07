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

function createTodoInNeo4J(todo, userAuth) {
  return `CREATE (n:Todo { id: ` + todo.id + `, message: ` + todo.message + `, userAuth: ` + userAuth + `})`
}

// this.store => a neo4j driver of database
export class TodoNeo4JAPI extends DataSource {
  
  constructor( store ) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }
  
  findTodo(id, userAuth) {
    var session = this.store.session({
      database: 'foo',
      defaultAccessMode: neo4j.session.WRITE
    })        

    let foundTodo;

    console.log(session)  

    // TODO use query params session run
    session.run(`MATCH (todo:Todo { id: $todoId })`, {todoId : id})
    .then(record => {
      console.log(record)    
      foundTodo = record;  
    })
    .catch(error => {
      console.log(error)
    })
    .then(() => session.close())   

    return foundTodo
  }

  getAllTodos() {
    var session = this.store.session({
      database: 'foo',
      defaultAccessMode: neo4j.session.READ
    })

    let allTodos;

    session.run('MATCH (n)', {})
    .then(result => {      
      console.log(result.records)
      allTodos = result.records;      
    })
    .catch(error => {
      console.log(error)
    })
    .then(() => session.close())
  

    return allTodos;
  }

  getTodosForUser(userAuth) {
    return filterTodos(this.store, userAuth);
  }

  deleteTodo(id) {
   return this.store.splice( this.store.indexOf({id: id}), 1 );
  }

  addTodo(todo, userAuth) {
    var session = this.store.session({
      database: 'foo',
      defaultAccessMode: neo4j.session.WRITE
    })        

    // TODO use query params session run
    session.run(createTodoInNeo4J(todo, userAuth), {})
    .then(record => {      
      console.log(record)      
    })
    .catch(error => {
      console.log(error)
    })
    .then(() => session.close())   
  }

  updateTodo(id, newmessage){
   var tmp = this.findTodo(id);
   if (tmp == undefined){return undefined}
   tmp.message = newmessage;
   return tmp
  }

}

export const ds = new TodoNeo4JAPI()

