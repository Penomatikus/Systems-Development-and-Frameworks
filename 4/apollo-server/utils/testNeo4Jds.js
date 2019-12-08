import { driver } from 'neo4j-driver';
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
  
  findTodo(id, userAuth) {
    const driver = new neo4j.driver(
      "bolt://localhost:7687",
      neo4j.auth.basic("neo4j", "123456789")
    ) 

    const session = driver.session()         

    let foundTodo;
    console.log("FIND_TODO_ID: " + id)  
    console.log("FIND_TODO_SESSION: " + session)  

    // TODO use query params session run
    session.run('MATCH (todo:Todo { id: $todoId }) return todo', {todoId : id})
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
 
  addTodo(todo, userAuth) {
    const driver = new neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', '123456789')
    ) 

    const session = driver.session()        
    
    // TODO use query params session run
    console.log("ADD TODO: " + todo.id + "  " + todo.message)
    const id = todo.id;
    const mymessage = todo.message; 
    const myuserAuth = userAuth;  
    const cypher = `CREATE (n:Todo { id: ${id}, message: ${mymessage}, userAuth: ${myuserAuth} })`;
    let test = 0;
    let sessionResult = session.run(cypher);
    console.log("SESSION_RUN: " + sessionResult.then(result => { console.log("RESULT: " + result) })) 
    session.run(cypher)
        .then(result => {
            test = 2
            console.log(result)
        })
        .catch(e => {
            // Output the error
            console.log(e);
        })
        .then(() => {
            // Close the Session
            return session.close();
        });
      console.log("Test:" + test)
  }

  updateTodo(id, newmessage){
   var tmp = this.findTodo(id);
   if (tmp == undefined){return undefined}
   tmp.message = newmessage;
   return tmp
  }

}

export const ds = new TodoNeo4JAPI()

