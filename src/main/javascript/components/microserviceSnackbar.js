import { connect } from 'react-redux';
import MicroserviceSnackbarComponent from './microserviceSnackbar.component';


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

const MicroserviceSnackbar = connect(mapStateToProps, mapDispatchToProps)(MicroserviceSnackbarComponent);
export default MicroserviceSnackbar;
