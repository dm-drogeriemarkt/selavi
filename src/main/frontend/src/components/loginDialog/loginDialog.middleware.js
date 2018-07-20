import { call, put, takeEvery } from 'redux-saga/effects';
import { actionCreator, actionFailed } from 'shared/actionHelper';
import loginApi from 'components/loginDialog/loginDialog.api';

export function* login(action) {
  try {
    const user = yield call(loginApi, action.payload);
    yield put(actionCreator('LOGIN_SUCCESS', user));
  } catch (e) {
    yield put(actionFailed('LOGIN_FAILED', e));
    yield put(actionCreator('OPEN_SNACKBAR', 'Stages konnten nicht geladen werden'));
  }
}

function* appSaga() {
  yield takeEvery('LOGIN_REQUESTED', login);
}

export default appSaga;
