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

    declareFilter(FILTER_MODE) {
        console.log('FILTERMODE: ' + FILTER_MODE)
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
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        } finally {
            session.close()
        }
        return foundTodo
    }

    async getAllTodos(FILTER_MODE) {
        var session = this.store.session()
        let allTodos = []
        let filter = this.declareFilter(FILTER_MODE)
        console.log(filter)

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
                    console.log(error)
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

    deleteTodo(id) {
        return this.store.splice(this.store.indexOf({ id: id }), 1)
    }

    async addTodo(todo, userAuth) {
        const driver = this.store
        const session = driver.session()
        const cypher = `CREATE (n:Todo { id: ${todo.id}, message: '${todo.message}', userAuth: '${userAuth}' })`
        try {
            await session.run(cypher).catch(e => {
                console.log(e)
            })
        } catch (error) {
            console.log('ERROR: ' + error)
        } finally {
            session.close()
        }
    }

    async updateTodo(id, newmessage) {
        const driver = this.store
        const session = driver.session()
        let updatedTodo

        const cypher = `MATCH (todo:Todo {id: ${id}}) SET todo.message = '${newmessage}' return todo as todo`
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
            console.log('ERROR: ' + error)
        } finally {
            session.close()
        }
        return updatedTodo
    }
}

export const ds = new TodoNeo4JAPI()
