import { connect } from 'react-redux';
import { onAddLink, onContextMenuOpen } from './microserviceMindmap.actions';
import { actionCreator } from 'shared/actionHelper';

import MicroserviceMindmapComponent from './microserviceMindmap.component';


const mapStateToProps = (state) => ({
  microservices: state.app.microservices,
  menuMode: state.app.menuMode,
  filterString: state.app.filterString,
  microserviceListResizeCount: state.app.microserviceListResizeCount,
  debugMode: state.app.debugMode,
  showVersions: state.app.showVersions,
  stage: state.app.stage
});

const mapDispatchToProps = dispatch => ({
  onSelectMicroserviceNode: (params) => {
    dispatch(actionCreator('SELECT_MICROSERVICE_NODE_REQUESTED', params));
  },
  onContextMenuOpen,
  onAddLink
});


const MicroserviceMindmap = connect(mapStateToProps, mapDispatchToProps)(MicroserviceMindmapComponent);
export default MicroserviceMindmap;
