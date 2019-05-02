import React, { Component } from 'react'
import { calCulateAttitude } from '../Utils/calBestAttitude'
import { connect } from 'react-redux'
import { getAllNode } from '../actions'

class Form extends Component {
    state = {
        nodes: [
            { id: 1, latitude: 428568.6913, longtitude: 872921.7377, attitude: 30 },
            { id: 2, latitude: 428646.7539, longtitude: 872900.0566, attitude: '' }
        ]
    }
    addNode = () => {
        const { nodes } = this.state
        const id = nodes.length + 1
        this.setState({
            nodes: [
                ...nodes,
                {
                    id: id,
                    latitude: '',
                    longtitude: '',
                    attitude: ''
                }
            ]
        })
    }
    onChangeNode = (e) => {
        const { nodes } = this.state
        const { id, name, value } = e.target
        const temp = nodes
        temp[id - 1][name] = value
        this.setState({
            nodes: temp
        })
    }
    onSubmit = () => {
        const { nodes } = this.state
        calCulateAttitude(nodes)
    }
    render() {
        const { nodes } = this.state;
        return (
            <div>
                <h1>FORM NODE  LIST</h1>
                <div className="input-node-title">
                    <p>ID</p>
                    <p>Latitude</p>
                    <p>Longtitude</p>
                    <p>Attitude</p>
                </div>
                {
                    nodes.map(({ id, latitude, longtitude, attitude }) => (
                        <div className="input-node">
                            <div>
                                <p>{id}</p>
                            </div>
                            <div>
                                <input onChange={this.onChangeNode} id={id} name="latitude" defaultValue={latitude}></input>
                            </div>
                            <div>
                                <input onChange={this.onChangeNode} id={id} name="longtitude" defaultValue={longtitude}></input>
                            </div>
                            <div>
                                <input onChange={this.onChangeNode} id={id} name="attitude" defaultValue={attitude}></input>
                            </div>
                        </div>
                    ))
                }
                <input type="file"></input>
                <button onClick={this.addNode}>ADD  NODE</button>
                <button onClick={this.onSubmit}>Submit</button>
            </div>
        )
    }
}

export default Form