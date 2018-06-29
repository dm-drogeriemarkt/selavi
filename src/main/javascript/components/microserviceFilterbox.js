import { connect } from 'react-redux';
import {
  onAddLink,
  onAddService,
  onCancel,
  onLogin,
  onLogout,
  onType,
  onUnhideServices,
  onShowVersions,
  onHideVersions
} from '../actions/microserviceFilderboxActions';
import MicroserviceFilterboxComponent from './microserviceFilterbox.component';

const mapStateToProps = (state) => ({
  menuMode: state.menuMode,
  loggedInUser: state.loggedInUser,
  filterString: state.filterString,
  showVersions: state.showVersions,
  stage: state.stage,
  hiddenMicroServices: state.hiddenMicroServices
});

const mapDispatchToProps = {
  onType,
  onLogin,
  onLogout,
  onAddLink,
  onShowVersions,
  onHideVersions,
  onAddService,
  onCancel,
  onUnhideServices
};


const MicroserviceFilterbox = connect(mapStateToProps, mapDispatchToProps)(MicroserviceFilterboxComponent);
export default MicroserviceFilterbox;
