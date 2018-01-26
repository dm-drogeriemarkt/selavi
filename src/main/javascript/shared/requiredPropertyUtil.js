export function getRequiredPropertyNames(inputTabsArray) {
  const flatObj = inputTabsArray.map((tab) => tab.inputFields).reduce((acc, el) => Object.assign(acc, el), {});

  const result = [];

  for (let key in flatObj) {
    if (flatObj[key].required) {
      result.push(key);
    }
  }

  return result;
}

export function hasAllRequiredProperties(service, fieldNameArray) {
  for (let i = 0; i < fieldNameArray.length; i += 1) {
    if (!service[fieldNameArray[i]]) {
      return false;
    }
  }

  return true;
}