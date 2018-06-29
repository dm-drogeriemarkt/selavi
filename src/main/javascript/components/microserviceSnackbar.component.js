import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from 'material-ui/Snackbar';


const propTypes = {
  menuMode: PropTypes.string,
  globalErrorMessage: PropTypes.string,
  onRequestClose: PropTypes.func.isRequired
};

const defaultProps = {
  menuMode: undefined,
  globalErrorMessage: undefined
};

const MicroserviceSnackbarComponent = props => {

  let open = false;
  let message = '';
  const { menuMode, globalErrorMessage, onRequestClose } = props;

  if (menuMode === 'ADD_LINK') {
    open = true;
    message = 'Add link mode: draw connection between services!';
  } else if (globalErrorMessage) {
    open = true;
    message = globalErrorMessage;
  }

  return (
    <Snackbar
      open={open}
      message={message}
      autoHideDuration={0}
      onRequestClose={() => onRequestClose()}
    />
  );
};

MicroserviceSnackbarComponent.propTypes = propTypes;
MicroserviceSnackbarComponent.defaultProps = defaultProps;

export default MicroserviceSnackbarComponent;
