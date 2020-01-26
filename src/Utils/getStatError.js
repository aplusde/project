import computePredict from './computePredict';

export const calculateError = (node = []) => {
  const meanError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + (predictAttitude - attitude);
    }, 0) / node.length;

  const meanOfPercentageError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + (predictAttitude - attitude) / attitude;
    }, 0) / node.length;

  const meanAbsoluteError = Math.abs(
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + (predictAttitude - attitude);
    }, 0) / node.length
  );

  const meanSquareError =
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + Math.pow(predictAttitude - attitude, 2);
    }, 0) / node.length;

  const rootMeanSquareError = Math.sqrt(
    node.reduce((acc, { predictAttitude, attitude }) => {
      return acc + Math.pow(predictAttitude - attitude, 2);
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
  const transformExponential = computePredict(
    lastPredictNode['exponential'],
    nodes
  );
  const transformLinear = computePredict(lastPredictNode['linear'], nodes);

  const transformSpherical = computePredict(
    lastPredictNode['spherical'],
    nodes
  );
  const transformPentaSpherical = computePredict(
    lastPredictNode['pentaspherical'],
    nodes
  );

  console.log({
    transformExponential,
    transformLinear,
    transformSpherical,
    transformPentaSpherical,
    lastPredictNode
  });
  const transformGaussian = computePredict(lastPredictNode['gaussian'], nodes);

  const errorOfExponential = calculateError(transformExponential);

  const errorOfLinear = calculateError(transformLinear);

  const errorOfSherical = calculateError(transformSpherical);

  const errorOfPentaSpherical = calculateError(transformPentaSpherical);

  const errorOfGaussian = calculateError(transformGaussian);

  const result = {
    exponential: errorOfExponential,
    linear: errorOfLinear,
    sherical: errorOfSherical,
    pentaspherical: errorOfPentaSpherical,
    gaussian: errorOfGaussian
  };
  console.log(result);
  return result;
};
