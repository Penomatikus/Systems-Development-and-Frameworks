const { DataSource } = require('apollo-datasource')

// function searchelement(mok, id) {
//   for (var i = 0; i < mok.length; i++) {
//     if (mok[i].id == id) {
//       return mok[i];
//     }
//   }
//   return "findTodo: element not found";
// }

function filterTodos(mok, userAuth) {
    var retArray = []

    for (var i = 0; i < mok.length; i++) {
        if (mok[i].userAuth == userAuth) {
            retArray.push(mok[i])
        }
    }

    if (retArray.length == 0) console.log('no valid todos found for user')
    return retArray
}

//filter modes for getAllTodos
export var FILTER_MODE = {
    ASC: 'asc',
    DESC: 'desc',
    NONE: 'none',
}

// this.store => a neo4j driver of database
export class TodoNeo4JAPI extends DataSource {
    constructor(store) {
        super()
        this.store = store
    }

    initialize(config) {
        this.context = config.context
    }

    nodeToTodoObject(foundNode) {
        return {
            id: foundNode.properties.id.low,
            message: foundNode.properties.message,
            userAuth: foundNode.properties.userAuth,
        }
    }

    declareFilter(FILTER_MODE, skip, limit) {
        let filter
        switch (String(FILTER_MODE)) {
            case 'asc': {
                filter = ' ORDER BY todo.id ASC'
                break
            }
            case 'desc': {
                filter = ' ORDER BY todo.id DESC'
                break
            }
            case 'none': {
                filter = ''
                break
            }
            default: {
                filter = 'test'
                break
            }
        }
        if (skip != -1) {
            filter += ` SKIP ${skip}`
        }
        if (limit != -1) {
            filter += ` LIMIT ${limit}`
        }

        return filter
    }

    async findTodo(id) {
        const driver = this.store
        const session = driver.session()
        let foundTodo

        try {
            await session
                .run(`MATCH (todo:Todo { id: ${id} }) return todo`)
                .then(result => {
                    const node = result.records[0].get('todo')
                    foundTodo = this.nodeToTodoObject(node)
                })
                .catch(error => {
                    console.log('ERROR in findTodo(): ' + error)
                })
        } catch (error) {
            console.log(error)
        } finally {
            session.close()
        }
        return foundTodo
    }

    //TODO
    async getDependencies(id) {
        const driver = this.store
        const session = driver.session()
        let foundTodo

        try {
            await session
                .run(`MATCH (:Todo { id: ${id} })-->(todo) RETURN todo`)
                .then(result => {
                    const node = result.records[0].get('todo')
                    foundTodo = this.nodeToTodoObject(node)
                })
                .catch(error => {
                    console.log('ERROR in getDependencies(): ' + error)
                })
        } catch (error) {
            console.log(error)
        } finally {
            session.close()
        }
        return foundTodo
    }

    async getAllTodos(FILTER_MODE, start, limit) {
        var session = this.store.session()
        let allTodos = []
        let filter = this.declareFilter(FILTER_MODE, start, limit)
        try {
            await session
                .run(`MATCH (todo:Todo) return todo ${filter}`)
                .then(result => {
                    result.records.forEach(element => {
                        allTodos.push(
                            this.nodeToTodoObject(element.get('todo'))
                        )
                    })
                })
                .catch(error => {
                    console.log('ERROR in getAllTodos(): ' + error)
                })
        } catch (error) {
            console.log(error)
        } finally {
            session.close()
        }
        return allTodos
    }

    getTodosForUser(userAuth) {
        return filterTodos(this.store, userAuth)
    }

    async deleteTodo(id) {
        const driver = this.store
        const session = driver.session()

        try {
            await session
                .run(`MATCH (n) WHERE n.id = ${id} detach delete n`)
                .catch(error => {
                    console.log('ERROR in deleteTodo(): ' + error)
                })
        } catch (error) {
            console.log(error)
        } finally {
            session.close()
        }
    }

    async deleteAll() {
        const driver = this.store
        const session = driver.session()

        try {
            await session.run(`MATCH (n) DETACH DELETE n;`).catch(error => {
                console.log(error)
            })
        } catch (error) {
            console.log('ERROR in deleteAll(): ' + error)
        } finally {
            session.close()
        }
    }

    async userExists(userAuth) {
        const driver = this.store
        const session = driver.session()
        let exists = false

        const cypher = `match (n:User {userAuth: '${userAuth}'}) return n`
        try {
            await session.run(cypher).then(result => {
                const nodecount = result.records.length
                if (nodecount > 0) {
                    exists = true
                }
            })
        } catch (error) {
            console.log('ERROR in userExists(): ' + error)
        } finally {
            session.close()
        }
        return exists
    }

    async addUser(userAuth) {
        const driver = this.store
        const session = driver.session()

        const cypher = `CREATE (n:User { userAuth: '${userAuth}' })`
        try {
            await session.run(cypher).catch(e => {
                console.log(e)
            })
        } catch (error) {
            console.log('ERROR in addUser(): ' + error)
        } finally {
            session.close()
        }
    }

    async addTodo(todo, userAuth, lastEdited) {
        const driver = this.store
        if ((await this.userExists(userAuth)) == false) {
            await this.addUser(userAuth)
        }

        const session = driver.session()
        const cypher = `CREATE (n:Todo { id: ${todo.id}, message: '${todo.message}', userAuth: '${userAuth}', lastEdited: '${lastEdited}' })`
        try {
            await session.run(cypher).catch(e => {
                console.log(e)
            })
        } catch (error) {
            console.log('ERROR in addTodo(): ' + error)
        } finally {
            session.close()
        }
    }

    async updateTodo(id, newmessage, lastEdited) {
        const driver = this.store
        const session = driver.session()
        let updatedTodo

        const cypher = `MERGE (todo:Todo {id: ${id}}) SET todo.message = '${newmessage}' SET todo.lastEdited = '${lastEdited}' return todo as todo`
        try {
            await session
                .run(cypher)
                .then(result => {
                    const node = result.records[0].get('todo')
                    updatedTodo = this.nodeToTodoObject(node)
                })
                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log('ERROR in updateTodo(): ' + error)
        } finally {
            session.close()
        }
        return updatedTodo
    }

    async addToDoDependency(firstID, secondID) {
        const driver = this.store
        const session = driver.session()

        try {
            await session
                .run(
                    `
MATCH (todo1:Todo {id: ${firstID}}), (todo2:Todo {id: ${secondID}}) 
WHERE NOT todo1.id = todo2.id 
MERGE (todo1)-[r:DEPENDS_ON]->(todo2) 
RETURN todo1.message, type(r), todo2.message
`
                )
                .catch(error => {
                    console.log('ERROR in addToDoDependency(): ' + error)
                })
        } catch (error) {
            console.log(error)
        } finally {
            session.close()
        }
    }

    async getToDoDependencies(firstID) {
        const driver = this.store
        const session = driver.session()

        let todos = []

        try {
            await session
                .run(
                    `MATCH (todo:Todo { id: ${firstID} })-[:DEPENDS_ON]->(todos) RETURN todos`
                )
                .then(result => {
                    result.records.forEach(element => {
                        todos.push(
                            this.nodeToTodoObject(element.get('todos'))
                        )
                    })
                })
                .catch(error => {
                    console.log('ERROR in getToDoDependencies(): ' + error)
                })
        } catch (error) {
            console.log(error)
        } finally {
            session.close()
        }
        return todos
    }
}

export const ds = new TodoNeo4JAPI()
