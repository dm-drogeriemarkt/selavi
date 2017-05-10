const React = require('react');
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from "material-ui/TextField";

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

    onSubmit() {
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
                primary={true}
                onTouchTap={this.props.onCancel.bind(this)}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this.onSubmit.bind(this)}
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

        return (
            <div>
                <Dialog
                    title="Login to SeLaVi"
                    actions={actions}
                    modal={true}
                    open={isOpen}>
                    <TextField ref="input_username"
                               floatingLabelText="Username"
                               hintText="Username"/>
                    <TextField ref="input_password"
                               floatingLabelText="Password"
                               hintText="Password"/>
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