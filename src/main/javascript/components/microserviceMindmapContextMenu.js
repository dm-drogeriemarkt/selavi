import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  onAddProperty,
  onDeleteLink,
  onDeleteService,
  onEditLink,
  onHideService,
  onShowService
} from './../actions/microserviceMindmapContextMenuActions';

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

const propTypes = {
  loggedInUser: PropTypes.object.isRequired,
  contextMenuServiceId: PropTypes.number.isRequired,
  onAddProperty: PropTypes.func.isRequired,
  contextMenuToId: PropTypes.number.isRequired,
  onDeleteService: PropTypes.func.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  contextMenuFromId: PropTypes.number.isRequired,
  onDeleteLink: PropTypes.func.isRequired,
  onShowService: PropTypes.func.isRequired,
  onEditLink: PropTypes.func.isRequired,
  onHideService: PropTypes.func.isRequired
};

const MicroserviceMindmapContextMenuComponent = props => {

  const { top, left } = props;
  const style = { position: 'fixed', top, left, zIndex: 999 };

  if (props.loggedInUser) {
    if (props.contextMenuServiceId) {
      return (
        <nav style={style} className="contextMenu">
          <button onClick={props.onAddProperty}>Edit Service</button>
          <button onClick={props.onDeleteService}>Delete Service</button>
          <button onClick={props.onHideService}>Hide Service</button>
        </nav>
      );
    } else if (props.contextMenuFromId && props.contextMenuToId) {
      return (
        <nav style={style} className="contextMenu">
          <button onClick={props.onDeleteLink}>Delete Link</button>
          <button onClick={props.onEditLink}>Edit Link</button>
        </nav>
      );
    }
  } else if (props.contextMenuServiceId) {
    return (
      <nav style={style} className="contextMenu">
        <button onClick={props.onShowService}>Service Details</button>
        <button onClick={props.onHideService}>Hide Service</button>
      </nav>
    );
  }

  return <nav hidden className="contextMenu"/>;
};

MicroserviceMindmapContextMenuComponent.propTypes = propTypes;
export { MicroserviceMindmapContextMenuComponent };

const MicroserviceMindmapContextMenu = connect(mapStateToProps, mapDispatchToProps)(MicroserviceMindmapContextMenuComponent);
export default MicroserviceMindmapContextMenu;
