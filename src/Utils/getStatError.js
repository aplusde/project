
export const calculateError = (node = [],model='exponential') => {
  const meanError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + (predictAttitude[model] - attitude);
    }, 0) / node.length;

  const meanOfPercentageError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + (predictAttitude[model] - attitude) / attitude;
    }, 0) / node.length;

  const meanAbsoluteError = Math.abs(
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + (predictAttitude[model] - attitude);
    }, 0) / node.length
  );

  const meanSquareError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + Math.pow(predictAttitude[model] - attitude, 2);
    }, 0) / node.length;

  const rootMeanSquareError = Math.sqrt(
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + Math.pow(predictAttitude[model] - attitude, 2);
    }, 0) / node.length
  );
  return {
    meanError,
    meanOfPercentageError,
    meanAbsoluteError,
    meanSquareError,
    rootMeanSquareError
  };
};

export const getAllErrorModel = (nodes = [], lastPredictNode = []) => {
  // node = [{ attitude , predictAttitude: {exponent, }}]
  // const transformExponential = computePredict(
  //   lastPredictNode['exponential'],
  //   nodes
  // );
  // const transformLinear = computePredict(lastPredictNode['linear'], nodes);

  // const transformSpherical = computePredict(
  //   lastPredictNode['spherical'],
  //   nodes
  // );
  // const transformPentaSpherical = computePredict(
  //   lastPredictNode['pentaspherical'],
  //   nodes
  // );

  // console.log({
  //   transformExponential,
  //   transformLinear,
  //   transformSpherical,
  //   transformPentaSpherical,
  //   lastPredictNode
  // });
  // const transformGaussian = computePredict(lastPredictNode['gaussian'], nodes);

  const errorOfExponential = calculateError(nodes,'exponential');

  const errorOfLinear = calculateError(nodes,'linear');

  const errorOfSherical = calculateError(nodes,'spherical');

  const errorOfPentaSpherical = calculateError(nodes,'pentaspherical');

  const errorOfGaussian = calculateError(nodes,'gaussian');
  const errorOfTrendline = calculateError(nodes,'trendline');

  const result = {
    exponential: errorOfExponential,
    linear: errorOfLinear,
    sherical: errorOfSherical,
    pentaspherical: errorOfPentaSpherical,
    gaussian: errorOfGaussian,
    trendline: errorOfTrendline,
  };
  return result;
};
