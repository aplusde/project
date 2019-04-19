import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllNode } from '../actions'

class Form extends Component {

    render() {
        console.log('===>', this)
        return (
            <div>
                <p>Name:</p>
                <p>{this.props.user.name}</p>
                <p>{this.props.user.surname}</p>
                <p>{this.props.user.parent.mother.name}</p>
                <p>My Brother</p>
                <p>
                    {
                        this.props.user.brother.map(value => {
                            return <div>{value.id},{value.name}</div>
                        })
                    }</p>
                <input onChange={this.props.handleChange} type="text" />
                <button onClick={this.props.handleGetAllNode}>getAPI</button>
            </div>
        )
    }
}
const mapStoreToProps = (store) => {
    return {
        user: store.user
    }
}
//mapDiaptachTOProps =  > function in action  connect with  middleware
const mapDisPatchToProps = (dispatch) => {
    return {
        handleGetAllNode: () => dispatch(getAllNode)
    }
}
export default connect(mapStoreToProps, mapDisPatchToProps)(Form)