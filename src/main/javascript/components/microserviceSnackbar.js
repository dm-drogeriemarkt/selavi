import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Snackbar from 'material-ui/Snackbar';

const mapStateToProps = (state) => ({
  menuMode: state.menuMode,
  globalErrorMessage: state.globalErrorMessage
});

const mapDispatchToProps = (dispatch) => ({
  onRequestClose() {
    dispatch({
      type: 'CANCEL_MENU_ACTION'
    });
  }
});

const propTypes = {
  menuMode: PropTypes.string.isRequired,
  globalErrorMessage: PropTypes.string.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

const MicroserviceSnackbar = props => {

  let open = false;
  let message = '';

  if (props.menuMode === 'ADD_LINK') {
    open = true;
    message = 'Add link mode: draw connection between services!';
  } else if (props.globalErrorMessage) {
    open = true;
    message = props.globalErrorMessage;
  }

  return (
    <Snackbar
      open={open}
      message={message}
      autoHideDuration={0}
      onRequestClose={() => props.onRequestClose()}
    />
  );
};

MicroserviceSnackbar.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(MicroserviceSnackbar);
