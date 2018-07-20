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
} from './microserviceFilderbox.actions';
import MicroserviceFilterboxComponent from './microserviceFilterbox.component';

const mapStateToProps = (state) => ({
  menuMode: state.app.menuMode,
  loggedInUser: state.app.loggedInUser,
  filterString: state.app.filterString,
  showVersions: state.app.showVersions,
  stage: state.app.stage,
  hiddenMicroServices: state.app.hiddenMicroServices
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
