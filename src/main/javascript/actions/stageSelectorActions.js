const rest = require('rest');
const mime = require('rest/interceptor/mime');
const errorCode = require('rest/interceptor/errorCode');

export function onStageSelected(stage) {
    return function (dispatch) {
        var client = rest.wrap(mime).wrap(errorCode);
        client({path: '/selavi/services/' + stage}).then(response => {
            dispatch({
                type: 'FETCH_MICROSERVICES_SUCCESS',
                stage: stage,
                response: response
            });
        });
    }
}
