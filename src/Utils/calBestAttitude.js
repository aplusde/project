import math from 'mathjs';
import createRangeTable from './createRangeTable';
import tranformSemivariance from './tranformSemivariance';
import createMatrix from './createMatrix';
import getStatError from './getStatError';

export const calCulateAttitude = (prod = []) => {
  console.log({ prod });
  //TODO: prod -> nodes
  let maxRange = 0;
  const range = createRangeTable(prod);

  range.map(({ range }) => {
    return range.map(v => {
      if (v > maxRange) {
        maxRange = v;
      }
    });
  });

  const allRangeOfNodes = range.map(({ range }) => range);
  const rangeArray = [];

  for (let i = 1; i <= 10; i++) {
    rangeArray.push((i * maxRange) / 10);
  }

  const data = calculateBestNuggetSillRange(range, maxRange);

  const bestNugget = 0;
  const bestSill = 0.1;
  const vairiantNodeObject = tranformSemivariance(range)(
    bestNugget,
    bestSill,
    maxRange
  );

  const modelexponential = calBestAttitudeLastNode(
    vairiantNodeObject,
    'exponential'
  );

  const modelLinear = calBestAttitudeLastNode(vairiantNodeObject, 'linear');
  const modelSpherical = calBestAttitudeLastNode(
    vairiantNodeObject,
    'spherical'
  );

  const result = {
    bestSum: data.bestSum, //node attitue 31
    allRangeOfNodes,
    semiVarioGram: data.semiVarioGram
  };

  return result;
};

const calBestAttitudeLastNode = (vairiantNodeObject, model = 'exponential') => {
  const convertMatrix = createMatrix(vairiantNodeObject);
  let A = convertMatrix;
  let b = vairiantNodeObject[vairiantNodeObject.length - 1][model];
  let w = math.multiply(math.inv(A), b);
  let sum = 0;
  for (let i = 0; i < vairiantNodeObject.length - 1; i += 1) {
    sum += vairiantNodeObject[i].attitude * w[i];
  }
  const errorPedictionModel = math.sum(
    math.dotMultiply(
      vairiantNodeObject[vairiantNodeObject.length - 1][model],
      w
    )
  );
  // to do add error model 5 mel
  return {
    sum,
    errorPedictionModel
  };
};

const calculateBestNuggetSillRange = (range, maxRange) => {
  let nuggetArray = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]; //11 //10
  let sillArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]; //  10
  let minError = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0
  };

  let semiVarioGram = {
    exponential: [],
    linear: [],
    spherical: [],
    pentaspherical: [],
    gaussian: []
  };

  let bestNugget = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0
  };

  let bestSill = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0
  };

  let bestRange = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0
  };

  let bestSum = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0
  };

  for (let i = 0; i < nuggetArray.length; i++) {
    for (let j = 0; j < sillArray.length; j++) {
      const vairiantNodeObject = tranformSemivariance(range)(
        +nuggetArray[i],
        +sillArray[j],
        maxRange
      );

      const modelExponential = calBestAttitudeLastNode(
        vairiantNodeObject,
        'exponential'
      );

      const modelLinear = calBestAttitudeLastNode(vairiantNodeObject, 'linear');

      const modelSpherical = calBestAttitudeLastNode(
        vairiantNodeObject,
        'spherical'
      );
      const modelPentaSpherical = calBestAttitudeLastNode(
        vairiantNodeObject,
        'pentaspherical'
      );
      const modelGussian = calBestAttitudeLastNode(
        vairiantNodeObject,
        'gaussian'
      );

      if (minError['gaussian'] === 0) {
        minError['gaussian'] = modelGussian.errorPedictionModel;
        bestNugget['gaussian'] = nuggetArray[i];
        bestSill['gaussian'] = sillArray[j];
        bestRange['gaussian'] = maxRange;
        bestSum['gaussian'] = modelGussian.sum;
        semiVarioGram['gaussian'] = vairiantNodeObject.map(
          ({ gaussian }) => gaussian
        );
      }
      if (modelGussian.errorPedictionModel < minError['gaussian']) {
        minError['gaussian'] = modelGussian.errorPedictionModel;
        bestNugget['gaussian'] = nuggetArray[i];
        bestSill['gaussian'] = sillArray[j];
        bestRange['gaussian'] = maxRange;
        bestSum['gaussian'] = modelGussian.sum;
        semiVarioGram['gaussian'] = vairiantNodeObject.map(
          ({ gaussian }) => gaussian
        );
      }
      //

      if (minError['pentaspherical'] === 0) {
        minError['pentaspherical'] = modelPentaSpherical.errorPedictionModel;
        bestNugget['pentaspherical'] = nuggetArray[i];
        bestSill['pentaspherical'] = sillArray[j];
        bestRange['pentaspherical'] = maxRange;
        bestSum['pentaspherical'] = modelPentaSpherical.sum;
        semiVarioGram['pentaspherical'] = vairiantNodeObject.map(
          ({ pentaspherical }) => pentaspherical
        );
      }
      if (
        modelPentaSpherical.errorPedictionModel < minError['pentaspherical']
      ) {
        minError['pentaspherical'] = modelPentaSpherical.errorPedictionModel;
        bestNugget['pentaspherical'] = nuggetArray[i];
        bestSill['pentaspherical'] = sillArray[j];
        bestRange['pentaspherical'] = maxRange;
        bestSum['pentaspherical'] = modelPentaSpherical.sum;
        semiVarioGram['pentaspherical'] = vairiantNodeObject.map(
          ({ pentaspherical }) => pentaspherical
        );
      }

      /*linear*/
      if (minError['linear'] === 0) {
        minError['linear'] = modelLinear.errorPedictionModel;
        bestNugget['linear'] = nuggetArray[i];
        bestSill['linear'] = sillArray[j];
        bestRange['linear'] = maxRange;
        bestSum['linear'] = modelLinear.sum;
        semiVarioGram['linear'] = vairiantNodeObject.map(
          ({ linear }) => linear
        );
      }
      if (modelLinear.errorPedictionModel < minError['linear']) {
        minError['linear'] = modelLinear.errorPedictionModel;
        bestNugget['linear'] = nuggetArray[i];
        bestSill['linear'] = sillArray[j];
        bestRange['linear'] = maxRange;
        bestSum['linear'] = modelLinear.sum;
        semiVarioGram['linear'] = vairiantNodeObject.map(
          ({ linear }) => linear
        );
      }
      /*linear*/

      /* spherical */
      if (minError['spherical'] === 0) {
        minError['spherical'] = modelSpherical.errorPedictionModel;
        bestNugget['spherical'] = nuggetArray[i];
        bestSill['spherical'] = sillArray[j];
        bestRange['spherical'] = maxRange;
        bestSum['spherical'] = modelSpherical.sum;
        semiVarioGram['spherical'] = vairiantNodeObject.map(
          ({ spherical }) => spherical
        );
      }
      if (modelSpherical.errorPedictionModel < minError['spherical']) {
        minError['spherical'] = modelSpherical.errorPedictionModel;
        bestNugget['spherical'] = nuggetArray[i];
        bestSill['spherical'] = sillArray[j];
        bestRange['spherical'] = maxRange;
        bestSum['spherical'] = modelSpherical.sum;
        semiVarioGram['spherical'] = vairiantNodeObject.map(
          ({ spherical }) => spherical
        );
      }
      /* spherical */

      /*exponential*/
      if (minError['exponential'] === 0) {
        minError['exponential'] = modelExponential.errorPedictionModel;
        bestNugget['exponential'] = nuggetArray[i];
        bestSill['exponential'] = sillArray[j];
        bestRange['exponential'] = maxRange;
        bestSum['exponential'] = modelExponential.sum;
        semiVarioGram['exponential'] = vairiantNodeObject.map(
          ({ exponential }) => exponential
        );
      }
      if (modelExponential.errorPedictionModel < minError['exponential']) {
        minError['exponential'] = modelExponential.errorPedictionModel;
        bestNugget['exponential'] = nuggetArray[i];
        bestSill['exponential'] = sillArray[j];
        bestRange['exponential'] = maxRange;
        bestSum['exponential'] = modelExponential.sum;
        semiVarioGram['exponential'] = vairiantNodeObject.map(
          ({ exponential }) => exponential
        );
      }
      /*exponential*/
    }
  }

  return {
    bestRange,
    bestNugget,
    bestSill,
    bestSum,
    semiVarioGram,
    minError
  };
};
