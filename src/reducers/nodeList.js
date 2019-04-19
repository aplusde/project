import { GET_ALLNODE } from '../actions'
const initialState = [
    { id: 1, x: '1', y: '2' },
    { id: 1, x: '3', y: '4' }
] //array

export default (state = initialState, action) => {

    switch (action.type) {
        case
            GET_ALLNODE:
            return action.payload  //[..nodes from api]

        default:
            return state
    }
}