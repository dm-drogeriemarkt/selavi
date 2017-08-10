import errorCode from 'rest/interceptor/errorCode';
import rest from 'rest';
import mime from 'rest/interceptor/mime';

export function onCancel() {
    return {
        type: 'CANCEL_MENU_ACTION',
    };
}

export function onSubmit(params) {
    return function (dispatch) {
        let request = {
            method: 'POST',
            path: '/selavi/login',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            entity: params.entity
        };

        let client = rest.wrap(mime).wrap(errorCode);
        client(request).then(response => {
            dispatch({
                type: 'LOGIN_SUCCESS',
                loggedInUser: response.entity
            });
        }, response => {
            dispatch({
                type: 'LOGIN_FAILED',
                message: response.entity.message
            });
        });
    }
}
