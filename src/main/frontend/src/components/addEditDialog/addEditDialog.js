import { connect } from 'react-redux';
import { onCancel, onSubmit } from './addEditDialog.actions';
import AddEditDialogComponent from './addEditDialog.component';


const mapStateToProps = (state) => ({
  menuMode: state.app.menuMode,
  entity: state.app.entity,
  topComitters: state.app.topComitters,
  addEditDialogFormAction: state.app.addEditDialogFormAction,
  autocompleteDataSource: state.app.autocompleteDataSource,
  stage: state.app.stage
});

const mapDispatchToProps = {
  onCancel,
  onSubmit
};

const AddEditDialog = connect(mapStateToProps, mapDispatchToProps)(AddEditDialogComponent);
export default AddEditDialog;
