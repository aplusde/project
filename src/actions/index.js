import axios from 'axios'
export const GET_ALLNODE = 'GET_ALLNODE'


export const getAllNode = () => {
    return async dispatch => { //middleware reduct-thunk
        const response = await axios.get('http://localhost:5000/')
        return dispatch({
            type: GET_ALLNODE,
            payload: response.data //[....nodes]
        })

    }
}