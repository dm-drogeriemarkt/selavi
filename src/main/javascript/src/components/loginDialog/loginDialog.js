import { connect } from 'react-redux';
import { actionCreator } from 'shared/actionHelper';
import LoginDialogComponent from './loginDialog.component';

const mapStateToProps = (state) => ({
  menuMode: state.app.menuMode,
  loginErrorMessage: state.app.loginErrorMessage
});

const mapDispatchToProps = (dispatch) => ({
  onCancel: () => {
    dispatch(actionCreator('CANCEL_MENU_ACTION'));
  },
  login: (options) => {
    dispatch(actionCreator('LOGIN_REQUESTED', options));
  }
});

const LoginDialog = connect(mapStateToProps, mapDispatchToProps)(LoginDialogComponent);
export default LoginDialog;
