import rest from 'rest';
import mime from 'rest/interceptor/mime';
import errorCode from 'rest/interceptor/errorCode';

export function onSubmit(entity, path, method, stage) {
    return function (dispatch) {
        let request = {
            entity: entity,
            headers: {
                'Content-Type': 'application/json'
            },
            path: path,
            method: method
        };

        let client = rest.wrap(mime).wrap(errorCode);
        client(request).then(() => {
            client({ path: '/selavi/services/' + stage }).then(response => {
                dispatch({
                    type: 'FETCH_MICROSERVICES_SUCCESS',
                    response: response
                });
            });
        }, response => {
            dispatch({
                type: 'ADD_EDIT_FAILED',
                message: response.entity.message
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
