import { driver } from 'neo4j-driver';
import { async } from 'rxjs/internal/scheduler/async';
var neo4j = require('neo4j-driver')

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
  
  async findTodo(id, userAuth) {
    const driver = this.store
    const session = driver.session()     
    let foundTodo;    

    try {
      await session.run(`MATCH (todo:Todo { id: ${id} }) return todo`)
        .then(result => { 
          const tmpTodo = result.records[0].get("todo"); 
          foundTodo = {
            id: tmpTodo.properties.id.low, 
            message: tmpTodo.properties.message, 
            userAuth: tmpTodo.properties.userAuth
          }}
          )
        .catch(error => { console.log(error)})
    } catch (error) {
      console.log(error)
    } finally {
      session.close()
    }
    return foundTodo
  }

  getAllTodos() {
    var session = this.store.session()

    let allTodos;

    session.run('MATCH (n) return n', {})
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
 
  async addTodo(todo, userAuth) {
    const driver = this.store  
    const session = driver.session()

    const cypher = `CREATE (n:Todo { id: ${todo.id}, message: '${todo.message}', userAuth: '${userAuth}' })`;
    try {
      await session.run(cypher).catch(e => { console.log(e); })
    } catch(error) { 
      console.log("ERROR: " + error)
    } finally {
        session.close()
    }
  }

  updateTodo(id, newmessage){
   var tmp = this.findTodo(id);
   if (tmp == undefined){return undefined}
   tmp.message = newmessage;
   return tmp
  }

}

export const ds = new TodoNeo4JAPI()

