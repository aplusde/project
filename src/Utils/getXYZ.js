export default (data = [], key) =>
  data.reduce((acc, next) => {
    const value = next[key];
    if (key === "attitude") {
      return [...acc, value];
    }
    return [...acc, value];

    // {attitude}
  }, []);
