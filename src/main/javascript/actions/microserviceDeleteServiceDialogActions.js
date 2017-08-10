import rest from 'rest';
import mime from 'rest/interceptor/mime';
import errorCode from 'rest/interceptor/errorCode';

export function onCancel() {
    return {
        type: 'CANCEL_MENU_ACTION',
    };
}

export function onSubmit(params) {
    return function (dispatch) {
        let request = {
            method: 'DELETE'
        };

        if (params.type === 'DELETE_SERVICE') {
            request.path = '/selavi/services/' + params.stage + '/' + params.deleteServiceId;
        } else if (params.type === 'DELETE_LINK') {
            request.path = '/selavi/services/' + params.stage + '/' + params.deleteLinkFromId + '/relations/' + params.deleteLinkToId;
        }

        let client = rest.wrap(mime).wrap(errorCode);
        client(request).then(() => {
            client({ path: '/selavi/services/' + params.stage }).then(response => {
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
