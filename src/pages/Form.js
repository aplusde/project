import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllNode } from '../actions'

class Form extends Component {
    render() {
        return (
            <div>
                <table>
                    <tr>
                        <th>Latitude</th>
                        <th>Longtitude</th>
                        <th>Attitude</th>
                    </tr>
                    {
                        this.props.nodes.map(({ latitude, longtitude, attitude }) => {
                            return <tr>
                                <td>{latitude}</td>
                                <td>{longtitude}</td>
                                <td>{attitude}</td>
                            </tr>
                        })
                    }


                </table>
                <button onClick={this.props.handleGetAllNode}>GET NODE LIST</button>
            </div>
        )
    }
}
const mapStoreToProps = (store) => {
    return {
        user: store.user,///kittinut -> John do
        nodes: store.nodesList //[]
    }
}

const mapDisPatchToProps = (dispatch) => {
    return {
        handleGetAllNode: () => dispatch(getAllNode())
    }
}
export default connect(mapStoreToProps, mapDisPatchToProps)(Form)