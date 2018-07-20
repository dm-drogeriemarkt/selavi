import { call, put, takeEvery } from 'redux-saga/effects';
import { actionCreator, actionFailed } from 'shared/actionHelper';
import { fetchMicroservicesApi, fetchAvailableStagesApi } from './app.api';


export function* fetchAvailableStages(action) {
  try {
    const availableStages = yield call(fetchAvailableStagesApi, action.payload);
    yield put(actionCreator('FETCH_AVAILABLE_STAGES_SUCCESS', availableStages));
  } catch (e) {
    yield put(actionFailed('FETCH_AVAILABLE_STAGES_FAILED', e));
  }
}

export function* fetchMicroservices(action) {
  try {
    const microservices = yield call(fetchMicroservicesApi, action.payload);
    yield put(actionCreator('FETCH_MICROSERVICES_SUCCESS', microservices));
  } catch (e) {
    yield put(actionFailed('FETCH_MICROSERVICES_FAILED', e));
  }
}

function* appSaga() {
  yield takeEvery('FETCH_AVAILABLE_STAGES_REQUESTED', fetchAvailableStages);
  yield takeEvery('FETCH_MICROSERVICES_REQUESTED', fetchMicroservices);
}

export default appSaga;
