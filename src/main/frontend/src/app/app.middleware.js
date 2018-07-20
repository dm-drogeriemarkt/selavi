import { call, put, takeEvery } from 'redux-saga/effects';
import { actionCreator, actionFailed } from 'shared/actionHelper';
import { fetchMicroservicesApi, fetchAvailableStagesApi } from './app.api';


export function* fetchAvailableStages(action) {
  try {
    const user = yield call(fetchAvailableStagesApi, action.payload);
    yield put(actionCreator('FETCH_AVAILABLE_STAGES_SUCCESS', user));
  } catch (e) {
    yield put(actionFailed('FETCH_AVAILABLE_STAGES_FAILED', e));
    yield put(actionCreator('OPEN_SNACKBAR', 'Stages konnten nicht geladen werden'));
  }
}

export function* fetchMicroservices(action) {
  try {
    const user = yield call(fetchMicroservicesApi, action.payload);
    yield put(actionCreator('FETCH_MICROSERVICES_SUCCESS', user));
  } catch (e) {
    yield put(actionFailed('FETCH_MICROSERVICES_FAILED', e));
    yield put(actionCreator('OPEN_SNACKBAR', 'Stages konnten nicht geladen werden'));
  }
}

function* appSaga() {
  yield takeEvery('FETCH_AVAILABLE_STAGES_REQUESTED', fetchAvailableStages);
  yield takeEvery('FETCH_MICROSERVICES_REQUESTED', fetchMicroservices);
}

export default appSaga;
