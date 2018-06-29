import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import SentimentNeutralIcon from 'material-ui/svg-icons/social/sentiment-neutral';
import SentimentVerySatisfiedIcon from 'material-ui/svg-icons/social/sentiment-very-satisfied';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const propTypes = {
  filterString: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  stage: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
  menuMode: PropTypes.string.isRequired,
  onAddService: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onAddLink: PropTypes.func.isRequired,
  onType: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  showVersions: PropTypes.any.isRequired,
  onHideVersions: PropTypes.any.isRequired,
  onShowVersions: PropTypes.any.isRequired,
  hiddenMicroServices: PropTypes.any.isRequired,
  onUnhideServices: PropTypes.any.isRequired
};

class MicroserviceFilterboxComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { linkUrl: undefined };
  }

  handleLinkAlertOpen() {
    const { filterString, stage } = this.props;
    let url = `${document.location.origin + document.location.pathname}?stage=${stage}`;

    if (filterString) {
      url += (`&filter=${filterString}`);
    }

    this.setState({ linkUrl: url });
  }

  handleLinkAlertClose() {
    this.setState({ linkUrl: undefined });
  }

  render() {

    let avatarToolGroup;
    const avatarStyle = { margin: 5 };

    let loginLogoutMenuItem;
    let addServiceMenuItem;
    let linkMenuItem;

    let showVersionsMenuItem;

    const {
      showVersions,
      onHideVersions,
      onShowVersions,
      loggedInUser,
      onLogout,
      menuMode,
      onCancel,
      onAddLink,
      onAddService,
      onLogin,
      hiddenMicroServices,
      onUnhideServices,
      filterString,
      onType
    } = this.props;
    const { linkUrl } = this.state;

    if (showVersions) {
      showVersionsMenuItem = (<MenuItem primaryText="Hide versions" onTouchTap={onHideVersions}/>);
    } else {
      showVersionsMenuItem = (<MenuItem primaryText="Show versions" onTouchTap={onShowVersions}/>);
    }

    if (loggedInUser) {
      let avatar;

      if (loggedInUser.thumbnailPhoto) {
        avatar = <Avatar
          src={`data:image/png;base64,${loggedInUser.thumbnailPhoto}`}
          style={avatarStyle}
        />;
      } else {
        avatar = <Avatar icon={<SentimentVerySatisfiedIcon/>} style={avatarStyle}/>;
      }

      avatarToolGroup = (
        <ToolbarGroup>
          {avatar}
          {loggedInUser.displayName}
        </ToolbarGroup>);

      loginLogoutMenuItem = (<MenuItem primaryText="Logout" onTouchTap={onLogout}/>);

      if (menuMode === 'ADD_LINK') {
        linkMenuItem = (<MenuItem primaryText="Cancel add link" onTouchTap={onCancel}/>);
      } else {
        linkMenuItem = (<MenuItem primaryText="Add link" onTouchTap={onAddLink}/>);
      }

      addServiceMenuItem = (
        <MenuItem primaryText="Add Service" onTouchTap={onAddService}/>);
    } else {
      avatarToolGroup = (
        <ToolbarGroup>
          <Avatar icon={<SentimentNeutralIcon/>} style={avatarStyle}/>
Not logged in
        </ToolbarGroup>);

      loginLogoutMenuItem = (<MenuItem primaryText="Login" onTouchTap={onLogin}/>);
    }
    const unhideServicesMenuItem = hiddenMicroServices.length > 0 ? (<MenuItem primaryText="Show Hidden" onTouchTap={onUnhideServices}/>) : undefined;

    return (
      <Toolbar>
        {avatarToolGroup}
        <ToolbarGroup>
          <ToolbarTitle text="SeLaVi - Service Landscape Visualizer"/>
        </ToolbarGroup>
        <ToolbarGroup>
          <TextField
            hintText="Filter services... (label, tags)"
            value={filterString}
            onChange={(event, value) => onType(value)}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <IconMenu
            iconButtonElement={
              <IconButton touch>
                <NavigationExpandMoreIcon/>
              </IconButton>
          }
          >
            {loginLogoutMenuItem}
            {addServiceMenuItem}
            {linkMenuItem}
            {unhideServicesMenuItem}
            {showVersionsMenuItem}
            <MenuItem primaryText="Share link" onTouchTap={() => this.handleLinkAlertOpen()}/>
          </IconMenu>
        </ToolbarGroup>
        <Dialog
          title="Link to current SeLaVi view"
          actions={<FlatButton
            label="Ok"
            primary
            onTouchTap={() => this.handleLinkAlertClose()}
          />}
          modal={false}
          open={!!linkUrl}
          onRequestClose={() => this.handleLinkAlertClose()}
        >
          <span>
            {linkUrl}
          </span>
        </Dialog>
      </Toolbar>
    );
  }
}

MicroserviceFilterboxComponent.propTypes = propTypes;

export default MicroserviceFilterboxComponent;