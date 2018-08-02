import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

const propTypes = {
  menuMode: PropTypes.string,
  deleteServiceId: PropTypes.number,
  deleteLinkFromId: PropTypes.number,
  deleteLinkToId: PropTypes.number,
  stage: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  deleteServiceErrorMessage: PropTypes.string
};

const defaultProps = {
  deleteLinkFromId: undefined,
  stage: undefined,
  deleteLinkToId: undefined,
  deleteServiceErrorMessage: undefined,
  menuMode: undefined,
  deleteServiceId: undefined
};

class MicroserviceDeleteServiceDialogComponent extends React.Component {

  onSubmit() {
    const {
      menuMode,
      deleteServiceId,
      deleteLinkFromId,
      deleteLinkToId,
      stage, onSubmit
    } = this.props;

    const params = {
      type: menuMode,
      deleteServiceId,
      deleteLinkFromId,
      deleteLinkToId,
      stage
    };

    onSubmit(params);
  }

  render() {
    const {
      onCancel,
      menuMode,
      deleteServiceId,
      deleteLinkFromId,
      deleteLinkToId,
      deleteServiceErrorMessage
    } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={() => onCancel}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => this.onSubmit}
      />
    ];

    let isOpen = false;
    let title = '';

    if (menuMode === 'DELETE_SERVICE') {
      isOpen = true;
      title = `Confirm deletion of service with id ${deleteServiceId}`;
    } else if (menuMode === 'DELETE_LINK') {
      isOpen = true;
      title = `Confirm deletion of link between services ${deleteLinkFromId} and ${deleteLinkToId}`;
    }

    const isErrorMessageOpen = (isOpen && !!deleteServiceErrorMessage);
    const errorMessage = `${deleteServiceErrorMessage}`;

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
MicroserviceDeleteServiceDialogComponent.defaultProps = defaultProps;

export default MicroserviceDeleteServiceDialogComponent;
