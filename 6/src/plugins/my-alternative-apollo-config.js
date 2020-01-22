export default function(context){
    return {
      httpEndpoint: 'http://localhost:4000/graphql',
      getAuth:() => 'apollo-token' // use this method to overwrite functions
    }
  }