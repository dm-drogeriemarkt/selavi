import { connect } from 'react-redux';
import { onCancel, onSubmit } from './microserviceDeleteServiceDialog.actions';
import MicroserviceDeleteServiceDialogComponent from './microserviceDeleteServiceDialog.component';

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

const MicroserviceDeleteServiceDialog = connect(mapStateToProps, mapDispatchToProps)(MicroserviceDeleteServiceDialogComponent);
export default MicroserviceDeleteServiceDialog;
