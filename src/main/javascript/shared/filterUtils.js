export function shouldFilterOut(microservice, filterString) {
    return (filterString && microservice.label) ? (microservice.label.toLowerCase().indexOf(filterString.toLowerCase()) === -1) : false;
}
