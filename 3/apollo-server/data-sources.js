import { TodoAPI } from './utils/testds'

export default function() {
  return { ds: new TodoAPI({id: 1,message:"a"},{id: 2,message:"b"}) };
}

