export default (allRangeOfNodes, semiVarioGram, model = 'exponential') => {
  let scatterGraph = new Array();
  for (let i = 0; i < allRangeOfNodes.length - 1; i++) {
    allRangeOfNodes[i].pop();
    semiVarioGram[model][i].pop();
    const range = allRangeOfNodes[i];
    const semi = semiVarioGram[model][i];
    scatterGraph.push({
      x: range,
      y: semi,
      mode: 'markers',
      name: `Node ${i + 1}`,
      type: 'scatter'
    });
  }
  return scatterGraph;
};
