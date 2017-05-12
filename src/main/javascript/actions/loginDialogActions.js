const rest = require('rest');
const mime = require('rest/interceptor/mime');
const errorCode = require('rest/interceptor/errorCode');

export function onCancel() {
    return {
        type: 'CANCEL_MENU_ACTION',
    };
}

export function onSubmit(params) {
    return function (dispatch) {
        var request = {
            method: 'POST',
            path: '/selavi/login',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            entity: params.entity
        }

        var client = rest.wrap(mime).wrap(errorCode);
        client(request).then(response => {
            dispatch({
                type: 'LOGIN_SUCCESS',
                loggedInUser: params.entity.username
            });
        }, response => {
            dispatch({
                type: 'LOGIN_FAILED',
                message: response.entity.message
            });
        });
    }
}
