import { combineReducers } from 'redux'
import nodesList from './nodeList'
import user from './user'

const root = combineReducers({
    nodesList, //[]
    user,
});
export default root;
//nodesList=[{id:'0',value:'1'}]
//varain = [{nugget:'1',sill:'2',ragne:'3'}]
// users //initialState = {name:'JOHN',surname:'DO'}