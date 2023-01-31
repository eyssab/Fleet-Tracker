// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { School, Route, Stop, Student } = initSchema(schema);

export {
  School,
  Route,
  Stop,
  Student
};