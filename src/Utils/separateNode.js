export const findCenter = (nodes) => {
  let tempX = 0;
  let tempY = 0;

  for (let i = 0; i < nodes.length; i++) {
    const { latitude, longtitude } = nodes[i];
    tempX += latitude;
    tempY += longtitude;
  }

  return {
    meanX: tempX / nodes.length,
    meanY: tempY / nodes.length,
  };
};

export const separateZone = (nodes, center) => {
  const { meanX, meanY } = center;
  let zoneArray = { 0: [], 1: [], 2: [], 3: [] };

  for (let i = 0; i < nodes.length; i++) {
    const { latitude, longtitude } = nodes[i];
    const numberLatitude = Number(latitude);
    const numberLongtitude = Number(longtitude);
    if (numberLatitude <= meanX && numberLongtitude >= meanY) {
      zoneArray[0] = [...zoneArray[0], nodes[i]];
    }

    if (numberLatitude >= meanX && numberLongtitude >= meanY) {
      zoneArray[1] = [...zoneArray[1], nodes[i]];
    }

    if (numberLatitude <= meanX && numberLongtitude <= meanY) {
      zoneArray[2] = [...zoneArray[2], nodes[i]];
    }

    if (numberLatitude >= meanX && numberLongtitude <= meanY) {
      zoneArray[3] = [...zoneArray[3], nodes[i]];
    }
  }
  return {
    ...zoneArray,
  };
};
