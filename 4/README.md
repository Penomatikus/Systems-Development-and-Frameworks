# SDaF EX 4

[![Build Status](https://travis-ci.com/Penomatikus/Systems-Development-and-Frameworks.svg?branch=build%2Fspammy)](https://travis-ci.com/Penomatikus/Systems-Development-and-Frameworks)

## Start Web Server
```
npm run serve
```
Zugriff:
http://localhost:8080/


### Start Apollo Server
```
npm run apollo
```
Playground:
http://localhost:4000/graphql

Api calls:
http://localhost:4000/meinejson.json  

### Start Neo4J ( http://debian.neo4j.org/repo )  
```
sudo neo4j start
```
Browser interface for neo4j: 
http://localhost:7474/  

### Startpunkte Umsetzung:

https://apollo.vuejs.org/guide/apollo/#apollo-options

https://www.apollographql.com/docs/tutorial/introduction/  

https://github.com/typicode/lowdb  

https://neo4j.com/docs/ogm-manual/current/introduction/

# Notes 
to run the test you have to turn off the server (test starts its own, otherwise the port is blocked)

# Exercise \#4

Test-drive the development of a GraphQL server.

- [x] 1. Refactor your backend so that all the data is stored in[Neo4J](https://neo4j.com/)..  
- [x] 2. You are allowed to use a query builder like [neo4j-graphql-js](https://github.com/neo4j-graphql/neo4j-graphql-js)
   but at least one of your mutations and queries should access the database
   directly with [Neo4j JS driver](https://github.com/neo4j/neo4j-javascript-driver)
   and a custom cypher statement.
- [x] 3. Your objects in the database should be connected in some way. If you have a
   relationship like
   ```
   (:User)<-[:ASSIGNED]-(:Todo)
   ```
   then this query should return todos and user objects:
   ```gql
   query {
     todos {
       assignedTo {
         name
       }
     }
   }
   ```
- [x] 4. Implement a filter (`WHERE` in cypher).
   which returns another custom type. E.g. a todo has an assignee, see point 6.
- [x] 5. Implement some ordering (`ORDER BY` in cypher).
- [x] 6. Implement pagination (`FIRST` and `LIMIT` in cypher).
- [x] 7. Implement an update mutation that uses `MERGE`.
- [x] 8. Write backend tests for all of the above.
- [ ] 9. Request a review from @roschaefer.
- [ ] 10. Request a review from sb. else.


If you copy code from other groups, please give credit to them in your commit
messages.
