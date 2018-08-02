import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
  loggedInUser: PropTypes.object,
  contextMenuServiceId: PropTypes.number,
  onAddProperty: PropTypes.func.isRequired,
  contextMenuToId: PropTypes.number,
  onDeleteService: PropTypes.func.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  contextMenuFromId: PropTypes.number,
  onDeleteLink: PropTypes.func.isRequired,
  onShowService: PropTypes.func.isRequired,
  onEditLink: PropTypes.func.isRequired,
  onHideService: PropTypes.func.isRequired
};

const defaultProps = {
  loggedInUser: undefined,
  contextMenuToId: undefined,
  contextMenuFromId: undefined,
  contextMenuServiceId: undefined
};

const MicroserviceMindmapContextMenuComponent = props => {

  const {
    top,
    left,
    loggedInUser,
    onAddProperty,
    onDeleteService,
    contextMenuServiceId,
    onDeleteLink,
    onEditLink,
    onShowService,
    onHideService,
    contextMenuFromId,
    contextMenuToId
  } = props;
  const style = {
    position: 'fixed', top, left, zIndex: 999
  };

  if (loggedInUser) {
    if (contextMenuServiceId) {
      return (
        <nav style={style} className="contextMenu">
          <button type="button" onClick={onAddProperty}>
Edit Service
          </button>
          <button type="button" onClick={onDeleteService}>
Delete Service
          </button>
          <button type="button" onClick={onHideService}>
Hide Service
          </button>
        </nav>
      );
    } if (contextMenuFromId && contextMenuToId) {
      return (
        <nav style={style} className="contextMenu">
          <button type="button" onClick={onDeleteLink}>
Delete Link
          </button>
          <button type="button" onClick={onEditLink}>
Edit Link
          </button>
        </nav>
      );
    }
  } else if (contextMenuServiceId) {
    return (
      <nav style={style} className="contextMenu">
        <button type="button" onClick={onShowService}>
Service Details
        </button>
        <button type="button" onClick={onHideService}>
Hide Service
        </button>
      </nav>
    );
  }

  return <nav hidden className="contextMenu"/>;
};

MicroserviceMindmapContextMenuComponent.propTypes = propTypes;
MicroserviceMindmapContextMenuComponent.defaultProps = defaultProps;

export default MicroserviceMindmapContextMenuComponent;
