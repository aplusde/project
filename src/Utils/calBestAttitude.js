import math from 'mathjs';
import createRangeTable from './createRangeTable';
import tranformSemivariance from './tranformSemivariance';
import createMatrix from './createMatrix';
export const calCulateAttitude = (prod = []) => {
  const { id, attitude } = prod[prod.length - 1];
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
  console.log(data);

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

  const modelinear = calBestAttitudeLastNode(vairiantNodeObject, 'linear');
  const modelspherical = calBestAttitudeLastNode(
    vairiantNodeObject,
    'spherical'
  );
  console.log({
    vairiantNodeObject,
    modelinear,
    modelexponential,
    modelspherical
  });

  return {
    bestSum: modelexponential.sum, //node attitue 31
    allRangeOfNodes,
    semiVarioGram: vairiantNodeObject.map(({ exponential }) => exponential)
  };
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

  let mockBestNugget = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0
  };

  let mockBestSil = {
    exponential: 0,
    linear: 0,
    spherical: 0,
    pentaspherical: 0,
    gaussian: 0
  };

  let mockBestRange = {
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

      const modelexponential = calBestAttitudeLastNode(
        vairiantNodeObject,
        'exponential'
      );

      const modelinear = calBestAttitudeLastNode(vairiantNodeObject, 'linear');
      const modelspherical = calBestAttitudeLastNode(
        vairiantNodeObject,
        'spherical'
      );
      const modelpentaspherical = calBestAttitudeLastNode(
        vairiantNodeObject,
        'pentaspherical'
      );
      const modelgussian = calBestAttitudeLastNode(
        vairiantNodeObject,
        'gaussian'
      );
      console.log(modelgussian.errorPedictionModel, modelgussian.sum);

      if (minError['gaussian'] === 0) {
        minError['gaussian'] = modelgussian.errorPedictionModel;
        mockBestNugget['gaussian'] = nuggetArray[i];
        mockBestSil['gaussian'] = sillArray[j];
        mockBestRange['gaussian'] = maxRange;
        bestSum['gaussian'] = modelgussian.sum;
        semiVarioGram['gaussian'] = vairiantNodeObject.map(
          ({ gaussian }) => gaussian
        );
      }
      if (modelgussian.errorPedictionModel < minError['gaussian']) {
        minError['gaussian'] = modelgussian.errorPedictionModel;
        mockBestNugget['gaussian'] = nuggetArray[i];
        mockBestSil['gaussian'] = sillArray[j];
        mockBestRange['gaussian'] = maxRange;
        bestSum['gaussian'] = modelgussian.sum;
        semiVarioGram['gaussian'] = vairiantNodeObject.map(
          ({ gaussian }) => gaussian
        );
      }
      //

      if (minError['pentaspherical'] === 0) {
        minError['pentaspherical'] = modelpentaspherical.errorPedictionModel;
        mockBestNugget['pentaspherical'] = nuggetArray[i];
        mockBestSil['pentaspherical'] = sillArray[j];
        mockBestRange['pentaspherical'] = maxRange;
        bestSum['pentaspherical'] = modelpentaspherical.sum;
        semiVarioGram['pentaspherical'] = vairiantNodeObject.map(
          ({ pentaspherical }) => pentaspherical
        );
      }
      if (
        modelpentaspherical.errorPedictionModel < minError['pentaspherical']
      ) {
        minError['pentaspherical'] = modelpentaspherical.errorPedictionModel;
        mockBestNugget['pentaspherical'] = nuggetArray[i];
        mockBestSil['pentaspherical'] = sillArray[j];
        mockBestRange['pentaspherical'] = maxRange;
        bestSum['pentaspherical'] = modelpentaspherical.sum;
        semiVarioGram['pentaspherical'] = vairiantNodeObject.map(
          ({ pentaspherical }) => pentaspherical
        );
      }

      /*linear*/
      if (minError['linear'] === 0) {
        minError['linear'] = modelinear.errorPedictionModel;
        mockBestNugget['linear'] = nuggetArray[i];
        mockBestSil['linear'] = sillArray[j];
        mockBestRange['linear'] = maxRange;
        bestSum['linear'] = modelinear.sum;
        semiVarioGram['linear'] = vairiantNodeObject.map(
          ({ linear }) => linear
        );
      }
      if (modelinear.errorPedictionModel < minError['linear']) {
        minError['linear'] = modelinear.errorPedictionModel;
        mockBestNugget['linear'] = nuggetArray[i];
        mockBestSil['linear'] = sillArray[j];
        mockBestRange['linear'] = maxRange;
        bestSum['linear'] = modelinear.sum;
        semiVarioGram['linear'] = vairiantNodeObject.map(
          ({ linear }) => linear
        );
      }
      /*linear*/

      /* spherical */
      if (minError['spherical'] === 0) {
        minError['spherical'] = modelspherical.errorPedictionModel;
        mockBestNugget['spherical'] = nuggetArray[i];
        mockBestSil['spherical'] = sillArray[j];
        mockBestRange['spherical'] = maxRange;
        bestSum['spherical'] = modelspherical.sum;
        semiVarioGram['spherical'] = vairiantNodeObject.map(
          ({ spherical }) => spherical
        );
      }
      if (modelspherical.errorPedictionModel < minError['spherical']) {
        minError['spherical'] = modelspherical.errorPedictionModel;
        mockBestNugget['spherical'] = nuggetArray[i];
        mockBestSil['spherical'] = sillArray[j];
        mockBestRange['spherical'] = maxRange;
        bestSum['spherical'] = modelspherical.sum;
        semiVarioGram['spherical'] = vairiantNodeObject.map(
          ({ spherical }) => spherical
        );
      }
      /* spherical */

      /*exponential*/
      if (minError['exponential'] === 0) {
        minError['exponential'] = modelexponential.errorPedictionModel;
        mockBestNugget['exponential'] = nuggetArray[i];
        mockBestSil['exponential'] = sillArray[j];
        mockBestRange['exponential'] = maxRange;
        bestSum['exponential'] = modelexponential.sum;
        semiVarioGram['exponential'] = vairiantNodeObject.map(
          ({ exponential }) => exponential
        );
      }
      if (modelexponential.errorPedictionModel < minError['exponential']) {
        minError['exponential'] = modelexponential.errorPedictionModel;
        mockBestNugget['exponential'] = nuggetArray[i];
        mockBestSil['exponential'] = sillArray[j];
        mockBestRange['exponential'] = maxRange;
        bestSum['exponential'] = modelexponential.sum;
        semiVarioGram['exponential'] = vairiantNodeObject.map(
          ({ exponential }) => exponential
        );
      }
      /*exponential*/
    }
  }

  return {
    mockBestRange,
    mockBestNugget,
    mockBestSil,
    bestSum,
    semiVarioGram,
    minError
  };
};
