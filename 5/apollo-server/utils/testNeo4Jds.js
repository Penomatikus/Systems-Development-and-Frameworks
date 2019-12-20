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

// this.store => a neo4j driver of database
export class TodoNeo4JAPI extends DataSource {
  
  constructor( store ) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  nodeToTodoObject(foundNode){
    return {
      id: foundNode.properties.id.low, 
      message: foundNode.properties.message, 
      userAuth: foundNode.properties.userAuth
    }
  }

 async deleteAll() {
    const driver = this.store
    const session = driver.session()     
    
    try {
      await session.run(`MATCH (n) DETACH DELETE n;`)
        .catch(error => { console.log(error)})
    } catch (error) {
      console.log(error)
    } finally {
      session.close()
    }
  }

  
  async findTodo(id, userAuth) {
    const driver = this.store
    const session = driver.session()     
    let foundTodo;    

    try {
      await session.run(`MATCH (todo:Todo { id: ${id} }) return todo`)
        .then(result => { 
          const node = result.records[0].get("todo"); 
          foundTodo = this.nodeToTodoObject(node)
        })
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
 

async userExists(userAuth){
    const driver = this.store  
    const session = driver.session()
    let exists = false;

    const cypher = `match (n:User {userAuth: '${userAuth}'}) return n`;
    try {
      await session.run(cypher).then(result => { 
        const nodecount = result.records.length;console.log(nodecount) ;
        if (nodecount > 0){ exists = true;}
      })
    } catch(error) { 
      //console.log("ERROR: " + error)
    } finally {
        session.close()
    }
    return exists;
}

  async addUser(userAuth) {
    const driver = this.store  
    const session = driver.session()    
    
    const cypher = `CREATE (n:User { userAuth: '${userAuth}' })`;
    try {
      await session.run(cypher).catch(e => { console.log(e); })
    } catch(error) { 
      console.log("ERROR: " + error)
    } finally {
        session.close()
    }
  }


  async addTodo(todo, userAuth) {
    const driver = this.store  
   
    
    if (await this.userExists(userAuth) == false){
    await this.addUser(userAuth);
    }

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

  async updateTodo(id, newmessage){
    const driver = this.store
    const session = driver.session()
    let updatedTodo;

    const cypher = `MATCH (todo:Todo {id: ${id}}) SET todo.message = '${newmessage}' return todo as todo`
    try {
      await session.run(cypher).then(result => { 
        const node = result.records[0].get("todo"); 
        updatedTodo = this.nodeToTodoObject(node)
      })
      .catch(error => { console.log(error)})
    } catch(error) { 
      console.log("ERROR: " + error)
    } finally {
        session.close()
    }
   return updatedTodo
  }

}

export const ds = new TodoNeo4JAPI()

