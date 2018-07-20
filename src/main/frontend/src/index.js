/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createSagaMiddleware from 'redux-saga';
import App from 'app';
import reducer from 'stores/microserviceStore';
import appSaga from 'app/app.middleware';
import loginSaga from 'components/loginDialog/loginDialog.middleware';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


registerServiceWorker();

const sagaMiddleware = createSagaMiddleware();

const composeMiddleware = () => {
  if (process.env.NODE_ENV === 'development') {

    return applyMiddleware(sagaMiddleware);
  }

  return applyMiddleware(sagaMiddleware);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, {}, composeEnhancers(composeMiddleware()));

sagaMiddleware.run(appSaga);
sagaMiddleware.run(loginSaga);

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <App/>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
