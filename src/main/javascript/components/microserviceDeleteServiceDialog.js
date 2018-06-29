import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import { onCancel, onSubmit } from './../actions/microserviceDeleteServiceDialogActions';

const mapStateToProps = (state) => ({
  menuMode: state.menuMode,
  deleteServiceId: state.deleteServiceId,
  deleteLinkFromId: state.deleteLinkFromId,
  deleteLinkToId: state.deleteLinkToId,
  deleteServiceErrorMessage: state.deleteServiceErrorMessage,
  stage: state.stage
});

const mapDispatchToProps = {
  onCancel,
  onSubmit
};

const propTypes = {
  menuMode: PropTypes.string.isRequired,
  deleteServiceId: PropTypes.number.isRequired,
  deleteLinkFromId: PropTypes.number.isRequired,
  deleteLinkToId: PropTypes.number.isRequired,
  stage: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  deleteServiceErrorMessage: PropTypes.string.isRequired
};

class MicroserviceDeleteServiceDialogComponent extends React.Component {

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
        primary
        onTouchTap={() => this.props.onCancel}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={() => this.onSubmit}
      />
    ];

    let isOpen = false;
    let title = '';

    if (this.props.menuMode === 'DELETE_SERVICE') {
      isOpen = true;
      title = `Confirm deletion of service with id ${this.props.deleteServiceId}`;
    } else if (this.props.menuMode === 'DELETE_LINK') {
      isOpen = true;
      title = `Confirm deletion of link between services ${this.props.deleteLinkFromId} and ${this.props.deleteLinkToId}`;
    }

    const isErrorMessageOpen = (isOpen && !!this.props.deleteServiceErrorMessage);
    const errorMessage = `${this.props.deleteServiceErrorMessage}`;

    return (
      <div>
        <Dialog
          title={title}
          actions={actions}
          modal
          open={isOpen}
        />
        <Snackbar
          open={isErrorMessageOpen}
          message={errorMessage}
          autoHideDuration={0}
        />
      </div>
    );
  }
}

MicroserviceDeleteServiceDialogComponent.propTypes = propTypes;
export { MicroserviceDeleteServiceDialogComponent };

const MicroserviceDeleteServiceDialog = connect(mapStateToProps, mapDispatchToProps)(MicroserviceDeleteServiceDialogComponent);
export default MicroserviceDeleteServiceDialog;
