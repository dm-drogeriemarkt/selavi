import { connect } from 'react-redux';
import {
  onAddProperty,
  onDeleteLink,
  onDeleteService,
  onEditLink,
  onHideService,
  onShowService
} from './microserviceMindmapContextMenu.actions';
import MicroserviceMindmapContextMenuComponent from './microserviceMindmapContextMenu.component';

const mapStateToProps = (state) => ({
  top: state.contextMenuTop,
  left: state.contextMenuLeft,
  contextMenuServiceId: state.contextMenuServiceId,
  contextMenuFromId: state.contextMenuFromId,
  contextMenuToId: state.contextMenuToId,
  loggedInUser: state.loggedInUser
});

const mapDispatchToProps = {
  onAddProperty,
  onDeleteService,
  onDeleteLink,
  onEditLink,
  onShowService,
  onHideService
};


const MicroserviceMindmapContextMenu = connect(mapStateToProps, mapDispatchToProps)(MicroserviceMindmapContextMenuComponent);
export default MicroserviceMindmapContextMenu;
