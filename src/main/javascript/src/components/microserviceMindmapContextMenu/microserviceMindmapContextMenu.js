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
  top: state.app.contextMenuTop,
  left: state.app.contextMenuLeft,
  contextMenuServiceId: state.app.contextMenuServiceId,
  contextMenuFromId: state.app.contextMenuFromId,
  contextMenuToId: state.app.contextMenuToId,
  loggedInUser: state.app.loggedInUser
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
