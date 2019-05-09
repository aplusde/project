import React, { Component } from 'react'
import Plot from 'react-plotly.js';
import { calCulateAttitude } from '../Utils/calBestAttitude'
import { connect } from 'react-redux'
import { getAllNode } from '../actions'
import * as XLSX from 'xlsx';
import getXYZ from '../Utils/getXYZ';

class Form extends Component {
    state = {
        nodes: [
            { id: 1, latitude: '', longtitude: '', attitude: '' },
        ],
        x:[],
        y:[],
        z:[]
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
    onChangeFile = e=>{
        const file = e.target.files[0];
       var name = file.name;
       const reader = new FileReader();
       let dataRetrive 
       reader.onload = (evt )=>{ 
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, {type:'binary'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {header:1});
            /* Update state */
             data.shift()
            const transformDataNode = data.reduce((array,next,index)=>{
            return [
                ...array,
                {
                id:index+1,
                latitude:next[0],
                longtitude:next[1],
                attitude:next[2]
                }
            ]
        },[])
            this.setState({
                nodes:transformDataNode
            },()=>console.log(this.state))
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
    onSubmit = () => {
        const { nodes } = this.state
       const attitude =  calCulateAttitude(nodes)
       let newNodesWithLastAttitude = nodes
       newNodesWithLastAttitude[newNodesWithLastAttitude.length-1].attitude=attitude
       const x = getXYZ(newNodesWithLastAttitude,'latitude')
       const y = getXYZ(newNodesWithLastAttitude,'longtitude')
       const z = getXYZ(newNodesWithLastAttitude,'attitude')
        this.setState({
            nodes:newNodesWithLastAttitude,
            x:x,
            y:y,
            z:z
        })

    }
    render() {
        const { nodes,x,y,z } = this.state;
        return (
            <div className="container-graph">
            <div style={{margin:'15px'}}>
                <h1>FORM NODE  LIST</h1>
                <div className="input-node-title">
                    <p>ID</p>
                    <p>Latitude</p>
                    <p>Longtitude</p>
                    <p>Attitude</p>
                </div>
                {
                    nodes.map(({ id, latitude, longtitude, attitude }) => (
                        <div key={id+latitude.toString()} className="input-node">
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
              
                <input onChange={this.onChangeFile} type="file"></input>
                <button onClick={this.addNode}>ADD  NODE</button>
                <button onClick={this.onSubmit}>Submit</button>
            </div>
            <div>
                  {
                    x.length>0?<Plot 
                        data={[
                            {
                            x: x,
                            y: y,
                            z: z,
                            type: 'mesh3d',
                            },
                        ]}
                        layout={{width: 900, height: 600, title: 'A Fancy Plot'}}
                    />:null
                }
            </div>
            </div>
        )
    }
}

export default Form