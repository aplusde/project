export default (nodes, bestSumList = []) => {
  //let transformNode = nodes;
  //transformNode[transformNode.length - 1].predictAttitude = bestSum;
  const nodeTransformPredict = nodes.reduce((acc, next, index) => {
    return [
      ...acc,
      {
        ...next,
        predictAttitude: bestSumList[index], //{exponent:0,guassian:1}
      },
    ];
  }, []);
  return nodeTransformPredict;
};

export const computeSeparatePredict = (
  nodes,
  bestSumList = [],
  listIdNodes = []
) => {
  //let transformNode = nodes;
  //transformNode[transformNode.length - 1].predictAttitude = bestSum;
  const nodeTransformPredict = nodes.reduce((acc, next, index) => {
    const { id } = next;
    const isContainId = listIdNodes.indexOf(id) !== -1;
    if (isContainId) {
      return [
        ...acc,
        {
          ...next,
          predictAttitude: bestSumList[index], //{exponent:0,guassian:1}
        },
      ];
    } else {
      return [
        ...acc,
        {
          ...next,
        },
      ];
    }
  }, []);
  return nodeTransformPredict;
};
