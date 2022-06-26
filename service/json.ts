export const mongoMapToJSON = (map: Map<any, any>) => {
  return JSON.parse(
    JSON.stringify(map)
  );
};
