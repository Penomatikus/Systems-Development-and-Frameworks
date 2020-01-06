import { MOCK_UP_DATASOURCE_CONTENT } from './utils/mockUpDs'
import { TodoAPI } from './utils/testds'

export default function() {
  return { ds: new TodoAPI(MOCK_UP_DATASOURCE_CONTENT) };
}

