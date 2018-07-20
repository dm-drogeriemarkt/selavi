import { connect } from 'react-redux';
import { onAddLink, onContextMenuOpen, onSelectMicroserviceNode } from './microserviceMindmap.actions';

import MicroserviceMindmapComponent from './microserviceMindmap.component';


const mapStateToProps = (state) => ({
  microservices: state.microservices,
  menuMode: state.menuMode,
  filterString: state.filterString,
  microserviceListResizeCount: state.microserviceListResizeCount,
  debugMode: state.debugMode,
  showVersions: state.showVersions,
  stage: state.stage
});

const mapDispatchToProps = {
  onSelectMicroserviceNode,
  onContextMenuOpen,
  onAddLink
};


const MicroserviceMindmap = connect(mapStateToProps, mapDispatchToProps)(MicroserviceMindmapComponent);
export default MicroserviceMindmap;
