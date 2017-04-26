export function getRequiredPropertyNames(inputTabsArray) {
    const flatObj = inputTabsArray.map((tab) => tab.inputFields)
        .reduce((acc, el) => Object.assign(acc, el), {});

    var result = [];
    
    for (var key in flatObj) {
        if (flatObj[key].required) {
            result.push(key);
        }
    }

    return result;
}

export function hasAllRequiredProperties(service, fieldNameArray) {
    for (var i = 0; i < fieldNameArray.length; i++) {
        if (!service[fieldNameArray[i]]) {
            return false;
        }
    }

    return true;
}