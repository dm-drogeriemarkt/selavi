const rest = require('rest');
const mime = require('rest/interceptor/mime');

export function onSubmit(entity, path, method) {
    return function (dispatch) {
        var request = {
            entity: entity,
            headers: {
                'Content-Type': 'application/json'
            },
            path: path,
            method: method
        };

        var client = rest.wrap(mime);
        client(request).then(response => {
            client({path: '/selavi/services'}).then(response => {
                dispatch({
                    type: 'FETCH_MICROSERVICES_SUCCESS',
                    response: response
                });
            });
        });
    }
}

export function onCancel() {
    return function (dispatch) {
        dispatch({
            type: 'CANCEL_MENU_ACTION'
        });
    }
}
