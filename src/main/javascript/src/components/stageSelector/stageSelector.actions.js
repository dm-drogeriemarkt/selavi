import errorCode from 'rest/interceptor/errorCode';
import rest from 'rest';
import mime from 'rest/interceptor/mime';

export default function onStageSelected(stage) {
  return (dispatch) => {
    const client = rest.wrap(mime).wrap(errorCode);
    client({ path: `/selavi/services/${stage}` }).then(response => {
      dispatch({
        type: 'FETCH_MICROSERVICES_SUCCESS',
        stage,
        response
      });
    });
  };
}
