import { connect } from 'react-redux';
import MicroserviceSnackbarComponent from './microserviceSnackbar.component';


const mapStateToProps = (state) => ({
  menuMode: state.app.menuMode,
  globalErrorMessage: state.app.globalErrorMessage
});

const mapDispatchToProps = (dispatch) => ({
  onRequestClose() {
    dispatch({
      type: 'CANCEL_MENU_ACTION'
    });
  }
});

const MicroserviceSnackbar = connect(mapStateToProps, mapDispatchToProps)(MicroserviceSnackbarComponent);
export default MicroserviceSnackbar;
