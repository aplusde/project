import React, { Component } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import Plot from "react-plotly.js";
import memoize from "fast-memoize";
import { calCulateAttitude } from "../Utils/calBestAttitude";
import Loader from "react-loader-spinner";
import * as XLSX from "xlsx";
import getXYZ from "../Utils/getXYZ";
import { getAllErrorModel } from "../Utils/getStatError";
import computePredict, {
  computeSeparatePredict,
} from "../Utils/computePredict";
import createScatterGraph from "../Utils/createScatterGraph";
import { Chart } from "react-google-charts";
import getTrendlines from "../Utils/getTrendlines";
// import { separatePoint } from "../Utils/separatePoint";
import ErrorTable from "../components/ErrorTable";
import NodeResultTable from "../components/NodeResultTable";
import { Link } from "react-router-dom";
import { findCenter, separateZone } from "../Utils/separateNode";

const memoizeCalCulateAttitude = memoize(calCulateAttitude);
class NodeWithSeparate extends Component {
  state = {
    nodes: [{ id: 1, latitude: "", longtitude: "", attitude: "" }],
    x: [],
    y: [],
    z: [],
    loading: false,
    variable: {
      nugget: "",
      sill: "",
      range: "",
    },
  };

  addNode = () => {
    const { nodes } = this.state;
    const id = nodes.length + 1;
    this.setState({
      nodes: [
        ...nodes,
        {
          id: id,
          latitude: "",
          longtitude: "",
          attitude: "",
        },
      ],
    });
  };
  onChangeFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      /* Update state */
      data.shift();
      const transformDataNode = data.reduce((array, next, index) => {
        return [
          ...array,
          {
            id: index + 1,
            latitude: next[0], //x
            longtitude: next[1], //y
            attitude: next[2], //z
            predictAttitude: next[3], //p
          },
        ];
      }, []);
      this.setState({
        nodes: transformDataNode,
      });
    };
    reader.readAsBinaryString(file);
  };
  onChangeNode = (id) => (e) => {
    const { nodes } = this.state;
    const { name, value } = e.target;
    const temp = nodes;
    temp[id - 1][name] = value;
    this.setState({
      nodes: temp,
    });
  };
  deleteNodes = (e) => {
    const { nodes } = this.state;
    const { id } = e.target;
    const nodeIdTarget = parseInt(id);
    const updateDeleteNode = nodes.filter(({ id }) => id !== nodeIdTarget);
    this.setState({
      nodes: updateDeleteNode,
    });
  };

  onSubmit = () => {
    const { nodes, loading, variable } = this.state;
    this.setState({
      loading: !loading,
    });
    const center = findCenter(nodes);
    const zone = separateZone(nodes, center);
    const key = Object.keys(zone);
    const newNode = [];
    // const semiVariGram = {}
    for (let i = 0; i < key.length; i++) {
      const selectedZone = zone[key[i]];
      const {
        bestSumList,
        bestSum,
        allRangeOfNodes,
        semiVarioGram,
      } = memoizeCalCulateAttitude(selectedZone, variable);

      console.log({
        bestSumList,
        bestSum,
        allRangeOfNodes,
        semiVarioGram,
      });
      const listId = selectedZone.map(({ id }) => id);

      const trasnformNodesWithPredict = computePredict(
        selectedZone,
        bestSumList,
        listId
      );
      newNode.push(...trasnformNodesWithPredict);
    }

    this.setState({
      // bestSumList,
      // lastPredictNode: bestSum,
      // allRangeOfNodes,
      // semiVarioGram,
      nodes: newNode.sort((a, b) => a.id < b.id),
      loading: false,
    });
    console.timeEnd("start");
  };
  handleChangeModel = (e) => {
    const value = e.target.value;
    this.setState({
      model: value,
    });
  };
  handleChangeValue = (e) => {
    const { name, value } = e.target;
    this.setState({
      variable: {
        ...this.state.variable,
        [name]: value,
      },
    });
  };
  render() {
    const {
      nodes,
      loading,
      lastPredictNode = false,
      allRangeOfNodes,
      semiVarioGram,
      model = "exponential",
      variable,
    } = this.state;
    const transformDataNode = nodes.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      return -1;
    });
    const scatterGraph = lastPredictNode
      ? createScatterGraph(allRangeOfNodes, semiVarioGram, model)
      : false;
    const x = getXYZ(transformDataNode, "latitude");
    const y = getXYZ(transformDataNode, "longtitude");
    const z = getXYZ(transformDataNode, "attitude");
    const isAllNodeHavePredict = nodes.every(
      ({ predictAttitude }) => predictAttitude !== undefined
    );
    const error = isAllNodeHavePredict
      ? getAllErrorModel(transformDataNode)
      : false;
    const trendlineData = lastPredictNode
      ? getTrendlines(allRangeOfNodes, semiVarioGram["exponential"])
      : [];
    const data = [["range", "semivarian"], ...trendlineData];
    const options = {
      title: "Exponential Polynomial Trendlines",
      legend: "none",
      crosshair: { trigger: "both", orientation: "both" },
      trendlines: {
        0: {
          type: "polynomial",
          degree: 3,
          visibleInLegend: true,
        },
      },
    };
    return (
      <div className="container-graph">
        {loading && (
          <div className="modal">
            <Loader type="Puff" color="#00BFFF" height="100" width="100" />
          </div>
        )}

        <div style={{ margin: "15px" }}>
          <Link to="/separate">To Separate node page</Link>
          <h1>
            {model.replace(/^\w/, (c) => c.toUpperCase()) || "Exponential"}
          </h1>
          <div>
            <h1>Model Selection</h1>
            <button onClick={this.handleChangeModel} value="exponential">
              Exponential Model
            </button>
            <button onClick={this.handleChangeModel} value="linear">
              Linear Model
            </button>
            <button onClick={this.handleChangeModel} value="spherical">
              Spherical Model
            </button>
            <button onClick={this.handleChangeModel} value="pentaspherical">
              Pentaspherical Model
            </button>
            <button onClick={this.handleChangeModel} value="gaussian">
              Gussian Model
            </button>
            <button onClick={this.handleChangeModel} value="trendline">
              Trendline Model
            </button>
            <button
              onClick={this.handleChangeModel}
              value="exponentialWithKIteration"
            >
              Exponential with K iteration Model
            </button>
            {!!variable.nugget && !!variable.sill && !!variable.range && (
              <button
                onClick={this.handleChangeModel}
                value="exponentialWithConstant"
              >
                Exponential with Constant
              </button>
            )}
          </div>
          <h1>Node list</h1>
          <input
            name="nugget"
            placeholder="nugget"
            onChange={this.handleChangeValue}
          />
          <input
            name="sill"
            placeholder="sill"
            onChange={this.handleChangeValue}
          />
          <input
            name="range"
            placeholder="range"
            onChange={this.handleChangeValue}
          />
          <div className="input-node-title">
            <p className="node-p-id">ID</p>
            <p className="node-unit">Latitude</p>
            <p className="node-unit">Longtitude</p>
            <p className="node-unit">Altitude</p>
            <p className="node-unit">Predicted Altitude</p>
          </div>

          {transformDataNode.map(
            ({ id, latitude, longtitude, attitude, predictAttitude }) => {
              return (
                <div key={id + latitude.toString()} className="input-node">
                  <div className="id-node">
                    <p>{id}</p>
                  </div>
                  <div>
                    <input
                      onChange={this.onChangeNode(id)}
                      name="latitude"
                      value={latitude || ""}
                    ></input>
                  </div>
                  <div>
                    <input
                      onChange={this.onChangeNode(id)}
                      name="longtitude"
                      value={longtitude || ""}
                    ></input>
                  </div>
                  <div>
                    <input
                      onChange={this.onChangeNode(id)}
                      name="attitude"
                      value={attitude || ""}
                    ></input>
                  </div>
                  <div>
                    <input
                      onChange={this.onChangeNode(id)}
                      name="predictAttitude"
                      value={isAllNodeHavePredict ? predictAttitude[model] : ""}
                    ></input>
                  </div>
                  <div>
                    <button id={id} onClick={this.deleteNodes}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            }
          )}

          <input onChange={this.onChangeFile} type="file"></input>
          <button onClick={this.addNode}>ADD NODE</button>
          <button onClick={this.onSubmit}>Submit</button>
          {error && (
            <div className="wrapper-export-excel">
              <ReactHTMLTableToExcel
                id="table-calculate-node-result-button"
                className="download-table-xls-button"
                table="table-calculate-node-result"
                filename="prediction_calculate_result"
                sheet="prediction_calculate_result"
                buttonText="Download as prediction"
              />
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="error-table"
                filename="errorSheet"
                sheet="ErrorSheetxls"
                buttonText="Download as errors report"
              />
            </div>
          )}
        </div>

        <div className="graph">
          {error && (
            <>
              <ErrorTable
                error={error}
                semiVarioGram={semiVarioGram}
                variable={variable}
              />

              <NodeResultTable list={transformDataNode} />
            </>
          )}
          {scatterGraph && (
            <Plot
              data={scatterGraph}
              layout={{
                width: 900,
                height: 600,
                title: "Semivariogram Analysis",
                xaxis: {
                  title: "Distance",
                },
                yaxis: {
                  title: "Semivariogram",
                },
              }}
            />
          )}
          {lastPredictNode ? (
            <Plot
              data={[
                {
                  x: x,
                  y: y,
                  z: z,
                  type: "mesh3d",
                  // intensity: [0, 0.33, 0.66, 10000000],
                  // colorscale: [
                  //     [0, 'rgb(255, 0, 0)'],
                  //     [0.5, 'rgb(0, 255, 0)'],
                  //     [10000000, 'rgb(0, 0, 255)']
                  // ]
                },
              ]}
              layout={{ width: 900, height: 600, title: "3D Surface Plots" }}
            />
          ) : null}
          {trendlineData.length > 0 && (
            <Chart
              chartType="ScatterChart"
              width="900px"
              height="600px"
              data={data}
              options={options}
              legendToggle
            />
          )}
        </div>
      </div>
    );
  }
}

export default NodeWithSeparate;
