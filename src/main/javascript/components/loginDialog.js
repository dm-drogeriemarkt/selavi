const React = require('react');
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from "material-ui/TextField";
import CircularProgress from 'material-ui/CircularProgress';

import {onCancel, onSubmit} from './../actions/loginDialogActions';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        loginErrorMessage: state.loginErrorMessage
    };
};

const mapDispatchToProps = {
    onCancel,
    onSubmit
};

export class LoginDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {inProgress: false};
    }

    componentWillMount() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && this.props.menuMode === 'LOGIN' && !this.state.inProgress) {
                this.onSubmit();
            }
        }, false);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.menuMode === 'LOGIN' && nextProps.menuMode != 'LOGIN') {
            this.setState({inProgress: false});
        } else if (this.props.menuMode != 'LOGIN' && nextProps.menuMode === 'LOGIN') {
            // this is a hack of some sort to give focus to username textfield when the login Dialog is shown:
            // first, this.refs.input_username is undefined when accessed in componentWillReceiveProps (or any other react lifecycle method) directly, but is available when using setTimeout(fn, 0)
            // => this is probably because material-ui Dialog is using an internal RenderToLayer component to lazily render its contents
            // second, setTimeout(fn, 0) is not working either: someone steals focus after a couple of milliseconds
            // => likely the same reason (input element being rendered somewhere else in reacts virtual dom before being brought into view)
            window.setTimeout((that) => {
                that.refs.input_username.focus();
            }, 200, this);
        }
    }

    onSubmit() {
        this.setState({inProgress: true});

        const params = {
            entity: {
                username: this.refs.input_username.getValue(),
                password: this.refs.input_password.getValue()
            }
        }

        this.props.onSubmit(params);
    }

    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.onCancel.bind(this)}
                disabled={this.state.inProgress}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this.onSubmit.bind(this)}
                disabled={this.state.inProgress}
            />,
        ];

        var isOpen = false;
        var isErrorMessageOpen = false;
        var errorMessage = "";

        if (this.props.menuMode === 'LOGIN') {
            isOpen = true;
            if (this.props.loginErrorMessage) {
                isErrorMessageOpen = true;
                errorMessage = this.props.loginErrorMessage;
            }
        }

        let textFieldStyle = {marginLeft: "1em"};

        let spinner = undefined;

        if (this.state.inProgress) {
            spinner = <CircularProgress size={60} thickness={7} style={{zIndex: 999, position: 'absolute', left: 'calc(50% - 30px)', top: 'calc(50% - 30px)'}}/>
        }

        return (
            <div>
                <Dialog
                    title="Login to SeLaVi"
                    actions={actions}
                    modal={true}
                    open={isOpen}>
                    <TextField ref="input_username"
                               floatingLabelText="Username"
                               hintText="Username"
                               style={textFieldStyle}
                               disabled={this.state.inProgress}/>
                    <TextField ref="input_password"
                               floatingLabelText="Password"
                               hintText="Password"
                               type="password"
                               style={textFieldStyle}
                               disabled={this.state.inProgress}/>
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

export default connect(mapStateToProps, mapDispatchToProps) (LoginDialog);