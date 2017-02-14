const React = require('react');
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import {onCancel, onSubmit} from './../actions/microserviceDeleteServiceDialogActions';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        deleteServiceId: state.deleteServiceId,
        deleteServiceErrorMessage: state.deleteServiceErrorMessage
    };
};

const mapDispatchToProps = {
    onCancel,
    onSubmit
};

export class MicroserviceDeleteServiceDialog extends React.Component {

    onSubmit() {
        this.props.onSubmit(this.props.deleteServiceId);
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

        const isOpen = (this.props.menuMode === 'DELETE_SERVICE');
        const title = 'Confirm deletion of service with id ' + this.props.deleteServiceId;

        const isErrorMessageOpen = (isOpen && !!this.props.deleteServiceErrorMessage);
        const errorMessage = '' + this.props.deleteServiceErrorMessage;

        return (
            <div>
                <Dialog
                    title={title}
                    actions={actions}
                    modal={true}
                    open={isOpen}>
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

export default connect(mapStateToProps, mapDispatchToProps) (MicroserviceDeleteServiceDialog);