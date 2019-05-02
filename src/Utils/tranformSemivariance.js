export default (node = []) => (NUGGET, SILL, RANGE) => node.reduce((acc, current) => {
    return [
        ...acc, //round 1 [] //round 2[{id:1,x:1,y2,rage:[...value]}] rund 3 [{..},{..}]
        {
            latitude: current.latitude,
            longtitude: current.longtitude,
            attitude: current.attitude,
            //  range:current.range,
            semi: current.range.reduce((acc, rangeValue) => {
                if (acc.length === current.range.length - 1) {
                    return [
                        ...acc,
                        1,
                    ]
                } else if (rangeValue === 0) {
                    return [
                        ...acc,
                        rangeValue,
                    ]
                } else {
                    return [
                        ...acc,
                        NUGGET + (SILL * (1 - Math.exp(-rangeValue / RANGE)))
                    ]
                }
            }, [])
        }
    ]
}, [])