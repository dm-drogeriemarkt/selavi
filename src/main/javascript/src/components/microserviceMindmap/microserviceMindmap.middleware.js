import { call, put, takeEvery } from 'redux-saga/effects';
import { actionCreator, actionFailed } from 'shared/actionHelper';
import selectMicroserviceNodeApi from './microserviceMindmap.api';


export function* selectMicroserviceNode(action) {
  try {
    const microserviceNode = yield call(selectMicroserviceNodeApi, action.payload);
    yield put(actionCreator('SELECT_MICROSERVICE_NODE_SUSCCESS', microserviceNode));
  } catch (e) {
    yield put(actionFailed('SELECT_MICROSERVICE_NODE_FAILED', e));
  }
}

function* appSaga() {
  yield takeEvery('SELECT_MICROSERVICE_NODE_REQUESTED', selectMicroserviceNode);
}

export default appSaga;
