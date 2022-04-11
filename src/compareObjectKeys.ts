// compares two object and returns new object comparing two
export function compareObjectKeys(object1: any, object2: any) {
  const result = {};

  Object.keys(object1).forEach((k) => {
    if (String(object1[k]) !== String(object2[k])) {
      result[k] = true;
    }
  });

  return result;
}
