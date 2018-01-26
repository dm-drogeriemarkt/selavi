import React from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import { onCancel, onSubmit } from './../actions/loginDialogActions';

const mapStateToProps = (state) => ({
  menuMode: state.menuMode,
  loginErrorMessage: state.loginErrorMessage
});

const mapDispatchToProps = {
  onCancel,
  onSubmit
};

const propTypes = {
  menuMode: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loginErrorMessage: PropTypes.string.isRequired
};

export class LoginDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = { inProgress: false };
  }

  componentWillMount() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && this.props.menuMode === 'LOGIN' && !this.state.inProgress) {
        this.onSubmit();
      }
    }, false);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.menuMode === 'LOGIN' && nextProps.menuMode !== 'LOGIN') {
      this.setState({ inProgress: false });
    } else if (this.props.menuMode !== 'LOGIN' && nextProps.menuMode === 'LOGIN') {
      // this is a hack of some sort to give focus to username textfield when the login Dialog is shown:
      // first, this.refs.input_username is undefined when accessed in componentWillReceiveProps (or any other react lifecycle method) directly, but is available when using setTimeout(fn, 0)
      // => this is probably because material-ui Dialog is using an internal RenderToLayer component to lazily render its contents
      // second, setTimeout(fn, 0) is not working either: someone steals focus after a couple of milliseconds
      // => likely the same reason (input element being rendered somewhere else in reacts virtual dom before being brought into view)
      const userInput = this.usernameInput;
      window.setTimeout(() => {
        userInput.focus();
      }, 200);
    }
  }

  onSubmit() {
    this.setState({ inProgress: true });

    const params = {
      entity: {
        username: this.usernameInput.getValue(),
        password: this.passwordInput.getValue()
      }
    };
    this.props.onSubmit(params);
  }

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        secondary
        onTouchTap={() => this.props.onCancel()}
        disabled={this.state.inProgress}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={() => this.onSubmit()}
        disabled={this.state.inProgress}
      />
    ];

    let isOpen = false;
    let isErrorMessageOpen = false;
    let errorMessage = '';

    if (this.props.menuMode === 'LOGIN') {
      isOpen = true;
      if (this.props.loginErrorMessage) {
        isErrorMessageOpen = true;
        errorMessage = this.props.loginErrorMessage;
      }
    }

    const textFieldStyle = { marginLeft: '1em' };

    let spinner;

    if (this.state.inProgress) {
      spinner = <CircularProgress
        size={60}
        thickness={7}
        style={{
          zIndex: 999,
          position: 'absolute',
          left: 'calc(50% - 30px)',
          top: 'calc(50% - 30px)'
        }}
      />;
    }

    return (
      <div>
        <Dialog
          title="Login to SeLaVi"
          actions={actions}
          modal
          open={isOpen}
        >
          <TextField
            ref={(ref) => {
              this.usernameInput = ref;
            }}
            floatingLabelText="Username"
            hintText="Username"
            style={textFieldStyle}
            disabled={this.state.inProgress}
          />
          <TextField
            ref={(ref) => {
              this.passwordInput = ref;
            }}
            floatingLabelText="Password"
            hintText="Password"
            type="password"
            style={textFieldStyle}
            disabled={this.state.inProgress}
          />
          {spinner}
        </Dialog>
        <Snackbar
          open={isErrorMessageOpen}
          message={errorMessage}
          autoHideDuration={0}
        />
      </div>
    );
  }
}

LoginDialog.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog);
