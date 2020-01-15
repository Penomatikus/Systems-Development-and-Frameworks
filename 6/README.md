# SDaF EX 6

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







# Exercise \#6

Start programming with NuxtJS and learn fullstack testing.

**Deadline is January 22th, 2020**

1. Create a NuxtJS app and write a couple of different page components. Your
   page component should have some level of nesting. Like `/nested.vue`,
   `/nested/index.vue` and `/nested/_id.vue`.
2. Connect your frontend with your backend via [apollo-module](https://github.com/nuxt-community/apollo-module).
   So if you update a data object in your frontend, it sends a graphql mutation
   to the backend.
3. Make use of apollo-module's [authentication helpers](https://github.com/nuxt-community/apollo-module#authentication).
4. Implement a page component which requires authentication. Make sure that your
   frontend returns a HTTP status code 403 if you are not allowed to see that
   page.
5. Request a review from @roschaefer.
6. Request a review from sb. else.

### How to get help

If you have troubles with the setup or dependencies, feel free to get in touch
with the open-source community: https://human-connection.org/discord
Most contributors know NuxtJS very well and can help with the setup.


### Optional exercises

1. Write frontend tests, mock `this.$apollo` and respond with some mocked data
   or simulate an error.
2. Write a fullstack test with https://www.cypress.io/.
3. Record and publish a pair-programming :heart_eyes:

If you copy code from other groups, please give credit to them in your commit
messages.

