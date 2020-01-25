import math from 'mathjs';
import createRangeTable from './createRangeTable';
import tranformSemivariance from './tranformSemivariance';
import createMatrix from './createMatrix';
export const calCulateAttitude = (prod = []) => {
  const { id, attitude } = prod[prod.length - 1];
  let maxRange = 0;
  const range = createRangeTable(prod); //calc range
  //   {
  //       range: [303.23,323.323]
  //   }
  range.map(({ range }) => {
    return range.map(v => {
      if (v > maxRange) {
        maxRange = v;
      }
    });
  });

  const allRangeOfNodes = range.map(({ range }) => range); //[303.23,323.323]
  const rangeArray = [];

  for (let i = 1; i <= 10; i++) {
    rangeArray.push((i * maxRange) / 10); // 100 [100,200,300,400]
  }

  let bestNugget = 0;
  let bestSill = 0.1;
  let min = 10;
  let bestSum = 0;
  let semiVarioGram;
  const vairiantNodeObject = tranformSemivariance(range)(
    bestNugget,
    bestSill,
    maxRange
  );
  const convertMatrix = createMatrix(vairiantNodeObject);
  let A = convertMatrix;
  let b = vairiantNodeObject[vairiantNodeObject.length - 1].semi;
  let w = math.multiply(math.inv(A), b);
  let sum = 0;
  for (let i = 0; i < vairiantNodeObject.length - 1; i += 1) {
    sum += vairiantNodeObject[i].attitude * w[i];
  }
  const error = math.sum(
    math.dotMultiply(vairiantNodeObject[vairiantNodeObject.length - 1].semi, w)
  );

  return {
    bestSum: sum, //node attitue 31
    allRangeOfNodes,
    semiVarioGram: vairiantNodeObject.map(({ semi }) => semi)
  };
};
