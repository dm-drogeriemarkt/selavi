import errorCode from 'rest/interceptor/errorCode';
import rest from 'rest';
import mime from 'rest/interceptor/mime';

export function onStageSelected(stage) {
    return function (dispatch) {
        let client = rest.wrap(mime).wrap(errorCode);
        client({ path: '/selavi/services/' + stage }).then(response => {
            dispatch({
                type: 'FETCH_MICROSERVICES_SUCCESS',
                stage: stage,
                response: response
            });
        });
    }
}
