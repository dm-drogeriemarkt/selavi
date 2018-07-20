import React from 'react';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';


const propTypes = {
  menuMode: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loginErrorMessage: PropTypes.string
};

const defaultProps = {
  loginErrorMessage: undefined,
  menuMode: undefined
};

class LoginDialogComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { inProgress: false };
    this.usernameInput = undefined;
    this.passwordInput = undefined;
  }

  componentWillMount() {
    const { menuMode } = this.props;
    const { inProgress } = this.state;
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && menuMode === 'LOGIN' && !inProgress) {
        this.onSubmit();
      }
    }, false);
  }

  componentWillReceiveProps(nextProps) {
    const { menuMode } = this.props;
    if (menuMode === 'LOGIN' && nextProps.menuMode !== 'LOGIN') {
      this.setState({ inProgress: false });
    } else if (menuMode !== 'LOGIN' && nextProps.menuMode === 'LOGIN') {
      // this is a hack of some sort to give focus to username textfield when the login Dialog is shown:
      // first, this.refs.input_username is undefined when accessed in componentWillReceiveProps (or any other react lifecycle method) directly, but is available when using setTimeout(fn, 0)
      // => this is probably because material-ui Dialog is using an internal RenderToLayer component to lazily render its contents
      // second, setTimeout(fn, 0) is not working either: someone steals focus after a couple of milliseconds
      // => likely the same reason (input element being rendered somewhere else in reacts virtual dom before being brought into view)
      window.setTimeout((that) => {
        that.usernameInput.focus();
      }, 200, this);
    }
  }

  onSubmit() {
    const { onSubmit } = this.props;
    this.setState({ inProgress: true });

    const params = {
      entity: {
        username: this.usernameInput ? this.usernameInput.getValue() : undefined,
        password: this.passwordInput ? this.passwordInput.getValue() : undefined
      }
    };
    onSubmit(params);
  }

  render() {

    const { inProgress } = this.state;
    const { onCancel, menuMode, loginErrorMessage } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        secondary
        onClick={() => onCancel()}
        disabled={inProgress}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => this.onSubmit()}
        disabled={inProgress}
      />
    ];

    let isOpen = false;
    let isErrorMessageOpen = false;
    let errorMessage = '';

    if (menuMode === 'LOGIN') {
      isOpen = true;
      if (loginErrorMessage) {
        isErrorMessageOpen = true;
        errorMessage = loginErrorMessage;
      }
    }

    const textFieldStyle = { marginLeft: '1em' };

    let spinner;

    if (inProgress) {
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
            disabled={inProgress}
          />
          <TextField
            ref={(ref) => {
              this.passwordInput = ref;
            }}
            floatingLabelText="Password"
            hintText="Password"
            type="password"
            style={textFieldStyle}
            disabled={inProgress}
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

LoginDialogComponent.propTypes = propTypes;
LoginDialogComponent.defaultProps = defaultProps;

export default LoginDialogComponent;
