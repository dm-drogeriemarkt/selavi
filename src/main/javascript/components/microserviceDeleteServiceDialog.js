import React from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import { onCancel, onSubmit } from './../actions/microserviceDeleteServiceDialogActions';

const mapStateToProps = (state) => {
    return {
        menuMode: state.menuMode,
        deleteServiceId: state.deleteServiceId,
        deleteLinkFromId: state.deleteLinkFromId,
        deleteLinkToId: state.deleteLinkToId,
        deleteServiceErrorMessage: state.deleteServiceErrorMessage,
        stage: state.stage
    };
};

const mapDispatchToProps = {
    onCancel,
    onSubmit
};

export class MicroserviceDeleteServiceDialog extends React.Component {

    onSubmit() {
        const params = {
            type: this.props.menuMode,
            deleteServiceId: this.props.deleteServiceId,
            deleteLinkFromId: this.props.deleteLinkFromId,
            deleteLinkToId: this.props.deleteLinkToId,
            stage: this.props.stage
        };

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

        let isOpen = false;
        let title = '';

        if (this.props.menuMode === 'DELETE_SERVICE') {
            isOpen = true;
            title = 'Confirm deletion of service with id ' + this.props.deleteServiceId;
        } else if (this.props.menuMode === 'DELETE_LINK') {
            isOpen = true;
            title = 'Confirm deletion of link between services ' + this.props.deleteLinkFromId + ' and ' + this.props.deleteLinkToId;
        }

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

export default connect(mapStateToProps, mapDispatchToProps)(MicroserviceDeleteServiceDialog);