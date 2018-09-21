import rest from 'rest';
import mime from 'rest/interceptor/mime';
import errorCode from 'rest/interceptor/errorCode';

export function loadFrontendConfig() {
    return function (dispatch) {
        let request = {
            headers: {
                'Content-Type': 'application/json'
            },
            path: '/selavi/frontendconfig',
            method: 'GET'
        };

        let client = rest.wrap(mime).wrap(errorCode);
        client(request).then(
            response => {
                dispatch({
                    type: 'FETCH_FRONTENDCONFIG_SUCCESS',
                    frontendConfig: response.entity
                });
            }, error => {
                dispatch({
                    type: 'FETCH_FRONTENDCONFIG_FAILED',
                    message: error.entity.message
                });
            });
    }
}