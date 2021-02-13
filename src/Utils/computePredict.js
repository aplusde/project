export default (bestSum, nodes, bestSumList = []) => {
  //let transformNode = nodes;
  //transformNode[transformNode.length - 1].predictAttitude = bestSum;
  const x = nodes.reduce((acc, next, index) => {
     return [
        ...acc,
        {
          ...next,
          predictAttitude: bestSumList[index] //{exponent:0,guassian:1}
        }
      ];
  }, []);
  return x;
};
