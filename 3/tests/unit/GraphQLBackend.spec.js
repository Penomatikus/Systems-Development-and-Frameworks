import { shallowMount } from "@vue/test-utils";
import ListItem from "@/components/ListItem.vue";

import fs from 'fs'
import path from 'path'
import resolvers from '../../apollo-server/resolvers'

import { TodoAPI } from '../../apollo-server/utils/testds'

const { ApolloServer, gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');

const typeDefs = fs.readFileSync(path.resolve(__dirname, '../../apollo-server/schema.graphql'), { encoding: 'utf8' })

const mok = [{id: 1,message:"a"},{id: 2,message:"b"}];  
const mocksds = new TodoAPI(mok);



const allMocks = () => mocksds
 
it('fetches single launch', async () => {
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ ds: mocksds }),
    context: () => ({id: 1,message:"a"},{id: 2,message:"b"}),
    mockEntireSchema: false,
    formatError: (err) => { console.log(err.stack); return err }
  });



const { query } = createTestClient(server);
const GET_TODO = gql`
query todo($id: Int!) {
    todo(id: $id) {
      id
      message
    }
  }
`;

const res = await query(
			{ query: GET_TODO, 
			  variables: { id: 1 } 
			}
);
//console.log(res)
expect(res.data.todo.message).toEqual("a");


});

