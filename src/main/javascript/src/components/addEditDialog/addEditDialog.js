import { connect } from 'react-redux';
import { onCancel, onSubmit } from './addEditDialog.actions';
import AddEditDialogComponent from './addEditDialog.component';


const mapStateToProps = (state) => ({
  menuMode: state.menuMode,
  entity: state.entity,
  topComitters: state.topComitters,
  addEditDialogFormAction: state.addEditDialogFormAction,
  autocompleteDataSource: state.autocompleteDataSource,
  stage: state.stage
});

const mapDispatchToProps = {
  onCancel,
  onSubmit
};

const AddEditDialog = connect(mapStateToProps, mapDispatchToProps)(AddEditDialogComponent);
export default AddEditDialog;
