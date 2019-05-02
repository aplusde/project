export default (data = []) => data.reduce((array, next) => {
  return [
    ...array,
    next.semi.reduce((prev, value) => {
      if (array.length === data.length - 1) {
        if (prev.length === data.length - 1) {
          return [
            ...prev,
            0
          ]
        }
        return [
          ...prev,
          1
        ]
      }
      return [
        ...prev,
        value,
      ]
    }, [])
  ]
}, [])
