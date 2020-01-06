# SDaF EX 5

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






# Exercise \#5

Learn how to use graphql-middlewares and start programming with NuxtJS.

**Deadline is January 8th, 2020**

- [x] 1. Optional tasks of exercise #3 are now required: Implement a permission
   layer around your app. Use [graphql-shield](https://github.com/maticzav/graphql-shield)
   and [graphql-middleware](https://github.com/prisma-labs/graphql-middleware).
   Here is some inspiration how your test cases could look like:
   ![Test cases for a permission layer](../3/permissions.png)
- [x] 2. Refactor your backend and frontend to show something different than just
   todos and users. Be creative.
- [x] 3. Do a remote pair-programming session. You can choose any pairing partner,
   either from our course or you can also ask our open-source community.
- [x] 4. Record your pair-programming session and publish it. Choose any software you
   want. If you don't like being on the web, disable your webcam and save the
   video as "unlisted". I recommend [PeerTube](https://joinpeertube.org/) to
   host the video but there is also this commercial platform called YouTube as
   an alternative. Send a link to your recorded video to htw@roschaefer.de.
- [x] 5. Write backend tests.
- [] 6. Request a review from @roschaefer.
- [] 7. Request a review from sb. else.

### Teaching goal

The point of exercise 3. and 4. is to socialize and see how easy it is to find
people from around the world who like to program with you and learn with you.
Even a recording of a pairing session can be interesting learning material.
Think of people who don't have access to public education, e.g. studying at a
university like you do.

Also, if you get stuck, people can help out. Often, developers wait for too long
before they ask for help. It causes a lot of frustration and this particular
situation happened for a team while working on exercise \#3.  Asking for help in
our community chat is quick and usually there is always somebody around who can
help out: https://human-connection.org/discord

### Optional exercises

1. Create a NuxtJS app and write a couple of different page components. Your
   page component should have some level of nesting. Like `/nested.vue`,
   `/nested/index.vue` and `/nested/_id.vue`.
2. Connect your frontend with your backend via [apollo-module](https://github.com/nuxt-community/apollo-module).
   So if you update a data object in your frontend, it sends a graphql mutation
   to the backend.
3. Make use of apollo-module's [authentication helpers](https://github.com/nuxt-community/apollo-module#authentication)
   and have at least one page component which requires authentication.
4. Write frontend tests, mock `this.$apollo` and respond with some mocked data or simulate an error.


If you copy code from other groups, please give credit to them in your commit
messages.
