const rest = require('rest');
const mime = require('rest/interceptor/mime');
const errorCode = require('rest/interceptor/errorCode');

export function onCancel() {
    return {
        type: 'CANCEL_MENU_ACTION',
    };
}

export function onSubmit(deleteServiceId) {
    return function (dispatch) {
        var request = {
            path: '/selavi/services/' + deleteServiceId,
            method: 'DELETE'
        }

        var client = rest.wrap(mime).wrap(errorCode);
        client(request).then(response => {
            client({path: '/selavi/services'}).then(response => {
                dispatch({
                    type: 'FETCH_MICROSERVICES_SUCCESS',
                    response: response
                });
            });
        }, response => {
            dispatch({
                type: 'DELETE_SERVICE_FAILED',
                message: response.entity.message
            });
        });
    }
}
