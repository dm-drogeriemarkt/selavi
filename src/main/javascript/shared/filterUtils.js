// these are the data fields that we want to search
const _fields = [
    'label',
    'tags'
]

export function shouldFilterOut(microservice, filterString) {

    if (!filterString) {
        // filter string empty, no need to filter anything
        return false;
    }

    for (var i = 0; i < _fields.length; i++) {
        if (_match(microservice[_fields[i]], filterString)) {
            return false;
        }
    }

    // filter string does not match any of the fields we search
    return true;
}

export function isFilterHit(fieldName, fieldValue, filterString) {

    if (!filterString) {
        // filter string empty, no hit
        return false;
    }

    var isSearchedField = false;

    for (var i = 0; i < _fields.length; i++) {
        if (fieldName === _fields[i]) {
            isSearchedField = true;
            break;
        }
    }

    if (!isSearchedField) {
        // fieldName is not one of the fields we want to search
        return false;
    }

    return _match(fieldValue, filterString);
}

function _match(fieldValue, filterString) {

    if (typeof fieldValue !== "string") {
        // fieldValue is not a string, cant be a hit
        return false;
    }

    return (fieldValue.toLowerCase().indexOf(filterString.toLowerCase()) != -1);
}

