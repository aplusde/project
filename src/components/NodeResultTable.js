import React from "react";
const NodeResultTable = ({ list }) => {
  const modelList = [
    "exponential",
    "linear",
    "spherical",
    "pentaspherical",
    "gaussian",
    "trendline",
  ];
  return (
    <table id="table-calculate-node-result">
      <thead>
        <tr>
          <th>latitude</th>
          <th>longtitude</th>
          <th>attitude</th>
          {modelList.map((key) => {
            return <th key={key}>Predict Attitude model: {key}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {list.map(({ id, latitude, longtitude, attitude, predictAttitude }) => {
          return (
            <tr key={id}>
              <td>{latitude}</td>
              <td>{longtitude}</td>
              <td>{attitude}</td>
              {modelList.map((key) => {
                return <td>{predictAttitude[key]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default NodeResultTable;
