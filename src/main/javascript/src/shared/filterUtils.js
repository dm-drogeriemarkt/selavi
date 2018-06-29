// these are the data fields that we want to search
const fields = [
  'label',
  'tags'
];

function match(fieldValue, filterString) {

  if (typeof fieldValue !== 'string') {
    // fieldValue is not a string, cant be a hit
    return false;
  }

  return (fieldValue.toLowerCase()
    .indexOf(filterString.toLowerCase()) !== -1);
}

export function shouldFilterOut(microservice, filterString) {

  if (!filterString) {
    // filter string empty, no need to filter anything
    return false;
  }

  for (let i = 0; i < fields.length; i += 1) {
    if (match(microservice[fields[i]], filterString)) {
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

  let isSearchedField = false;

  for (let i = 0; i < fields.length; i += 1) {
    if (fieldName === fields[i]) {
      isSearchedField = true;
      break;
    }
  }

  if (!isSearchedField) {
    // fieldName is not one of the fields we want to search
    return false;
  }

  return match(fieldValue, filterString);
}

