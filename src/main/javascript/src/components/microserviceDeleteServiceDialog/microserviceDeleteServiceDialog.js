import { connect } from 'react-redux';
import { onCancel, onSubmit } from './microserviceDeleteServiceDialog.actions';
import MicroserviceDeleteServiceDialogComponent from './microserviceDeleteServiceDialog.component';

const mapStateToProps = (state) => ({
  menuMode: state.app.menuMode,
  deleteServiceId: state.app.deleteServiceId,
  deleteLinkFromId: state.app.deleteLinkFromId,
  deleteLinkToId: state.app.deleteLinkToId,
  deleteServiceErrorMessage: state.app.deleteServiceErrorMessage,
  stage: state.app.stage
});

const mapDispatchToProps = {
  onCancel,
  onSubmit
};

const MicroserviceDeleteServiceDialog = connect(mapStateToProps, mapDispatchToProps)(MicroserviceDeleteServiceDialogComponent);
export default MicroserviceDeleteServiceDialog;
