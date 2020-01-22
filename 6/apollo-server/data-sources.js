import {TodoNeo4JAPI} from './utils/TodoNeo4JAPI'
import { createJwt } from './utils/jwtCreator'
var neo4j = require('neo4j-driver')

export default function() {
    const drv = new neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j', 'ggs') )
    let ds = new TodoNeo4JAPI(drv)
    ds.addUser('anon','1234') 
    return { ds: ds }
}
