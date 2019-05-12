import React, { Component } from 'react'
import Plot from 'react-plotly.js';
import { ClipLoader } from 'react-spinner';
import { calCulateAttitude } from '../Utils/calBestAttitude'
import { connect } from 'react-redux'
import { getAllNode } from '../actions'
import * as XLSX from 'xlsx';
import getXYZ from '../Utils/getXYZ';


const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class Form extends Component {
    state = {
        nodes: [
            { id: 1, latitude: '', longtitude: '', attitude: '' },
        ],
        x: [],
        y: [],
        z: [],
        loading: true,
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
    onChangeFile = e => {
        const file = e.target.files[0];
        var name = file.name;
        const reader = new FileReader();
        let dataRetrive
        reader.onload = (evt) => {
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            /* Update state */
            data.shift()
            const transformDataNode = data.reduce((array, next, index) => {
                return [
                    ...array,
                    {
                        id: index + 1,
                        latitude: next[0],
                        longtitude: next[1],
                        attitude: next[2]
                    }
                ]
            }, [])
            this.setState({
                nodes: transformDataNode
            }, () => console.log(this.state))
        };
        reader.readAsBinaryString(file);
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
    deleteNodes = (e) => {
        console.log(e.target.id)
        const { nodes } = this.state
        const { id } = e.target
        const nodeIdTarget = parseInt(id)
        const updateDeleteNode = nodes.filter(({ id }) => id !== nodeIdTarget)
        console.log(nodes)
        console.log(updateDeleteNode)
        this.setState({
            nodes: updateDeleteNode
        })
    }
    onSubmit = () => {
        const { nodes } = this.state
        console.log(nodes)
        const { bestSum, allRangeOfNodes, semiVarioGram } = calCulateAttitude(nodes)
        let scatterGraph = []
        for (let i = 0; i < allRangeOfNodes.length - 1; i++) {
            allRangeOfNodes[i].pop()
            semiVarioGram[i].pop()
            const range = allRangeOfNodes[i]
            const semi = semiVarioGram[i]
            scatterGraph = [
                ...scatterGraph,
                {
                    x: range,
                    y: semi,
                    mode: 'markers',
                    name: `Node ${i + 1}`,
                    type: 'scatter'
                }
            ]
        }
        console.log(scatterGraph)
        let newNodesWithLastAttitude = nodes
        newNodesWithLastAttitude[newNodesWithLastAttitude.length - 1].attitude = bestSum
        const x = getXYZ(newNodesWithLastAttitude, 'latitude')
        const y = getXYZ(newNodesWithLastAttitude, 'longtitude')
        const z = getXYZ(newNodesWithLastAttitude, 'attitude')
        this.setState({
            nodes: newNodesWithLastAttitude,
            x: x,
            y: y,
            z: z,
            scatterGraph
        })

    }
    render() {
        const { nodes, x, y, z } = this.state;
        return (
            <div className="container-graph">
                <ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={150}
                    color={'#123abc'}
                    loading={this.state.loading}
                />
                <div style={{ margin: '15px' }}>
                    <h1>FORM NODE  LIST</h1>
                    <div className="input-node-title">
                        <p className="node-p-id">ID</p>
                        <p className="node-unit">Latitude</p>
                        <p className="node-unit">Longtitude</p>
                        <p className="node-unit">Attitude</p>
                    </div>
                    {
                        nodes.map(({ id, latitude, longtitude, attitude }) => (
                            <div key={id + latitude.toString()} className="input-node">
                                <div className="id-node">
                                    <p>{id}</p>
                                </div>
                                <div>
                                    <input onChange={this.onChangeNode} id={id} name="latitude" value={latitude} defaultValue={latitude}></input>
                                </div>
                                <div>
                                    <input onChange={this.onChangeNode} id={id} name="longtitude" value={longtitude} defaultValue={longtitude}></input>
                                </div>
                                <div>
                                    <input onChange={this.onChangeNode} id={id} name="attitude" value={attitude} defaultValue={attitude}></input>
                                </div>
                                <div>
                                    <button id={id} onClick={this.deleteNodes}>Delete</button>
                                </div>


                            </div>
                        ))
                    }

                    <input onChange={this.onChangeFile} type="file"></input>
                    <button onClick={this.addNode}>ADD  NODE</button>
                    <button onClick={this.onSubmit}>Submit</button>
                </div>
                <div className="graph">
                    {
                        x.length > 0 ? <Plot
                            data={[
                                {
                                    x: x,
                                    y: y,
                                    z: z,
                                    type: 'mesh3d',
                                    // intensity: [0, 0.33, 0.66, 10000000],
                                    // colorscale: [
                                    //     [0, 'rgb(255, 0, 0)'],
                                    //     [0.5, 'rgb(0, 255, 0)'],
                                    //     [10000000, 'rgb(0, 0, 255)']
                                    // ]
                                },
                            ]}
                            layout={{ width: 900, height: 600, title: '3D Surface Plots' }}
                        /> : null
                    }
                    {
                        this.state.scatterGraph && <Plot
                            data={this.state.scatterGraph}
                            layout={{
                                width: 900, height: 600, title: 'Semivariogram Analysis',
                                xaxis: {
                                    title: 'Distance'
                                },
                                yaxis: {
                                    title: 'Semivariogram'
                                }
                            }}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default Form