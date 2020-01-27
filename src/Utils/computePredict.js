export default (bestSum, nodes) => {
  //let transformNode = nodes;
  //transformNode[transformNode.length - 1].predictAttitude = bestSum;
  const x = nodes.reduce((acc, next, index) => {
    if (index === nodes.length - 1) {
      return [
        ...acc,
        {
          ...next,
          predictAttitude: bestSum
        }
      ];
    }
    return [...acc, next];
  }, []);
  return x;
};
