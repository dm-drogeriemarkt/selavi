import rest from 'rest';
import mime from 'rest/interceptor/mime';
import errorCode from 'rest/interceptor/errorCode';

export function onType(event, value) {
  return {
    type: 'FILTERBOX_TYPE',
    filterString: value
  };
}

export function onLogin() {
  return {
    type: 'LOGIN'
  };
}

export function onLogout() {
  return (dispatch) => {
    const request = {
      method: 'POST',
      path: '/selavi/logout'
    };

    const client = rest.wrap(mime).wrap(errorCode);
    client(request).then(() => {
      dispatch({
        type: 'LOGOUT_SUCCESS'
      });
    }, response => {
      dispatch({
        type: 'LOGOUT_FAILED',
        message: response.entity.message
      });
    });
  };
}

export function onAddLink() {
  return {
    type: 'ADD_LINK'
  };
}

export function onShowVersions() {
  return {
    type: 'SHOW_VERSIONS'
  };
}

export function onHideVersions() {
  return {
    type: 'HIDE_VERSIONS'
  };
}

export function onAddService() {
  return {
    type: 'ADD_SERVICE'
  };
}

export function onCancel() {
  return {
    type: 'CANCEL_MENU_ACTION'
  };
}

export function onUnhideServices() {
  return {
    type: 'UNHIDE_SERVICES'
  };
}
