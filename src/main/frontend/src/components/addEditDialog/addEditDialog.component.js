import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import { Tab, Tabs } from 'material-ui/Tabs';
import AutoComplete from 'material-ui/AutoComplete';
import Avatar from 'material-ui/Avatar';
import rest from 'rest';
import mime from 'rest/interceptor/mime';
import { List, ListItem } from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import LinkTextField from 'components/linkTextField';


const propTypes = {
  menuMode: PropTypes.string,
  stage: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editMenuMode: PropTypes.string.isRequired,
  addMenuMode: PropTypes.string.isRequired,
  addEditDialogFormAction: PropTypes.string,
  inputTabs: PropTypes.array.isRequired,
  topComitters: PropTypes.array,
  showMenuMode: PropTypes.string,
  entityDisplayName: PropTypes.string.isRequired,
  entity: PropTypes.object
};

const defaultProps = {
  menuMode: undefined,
  stage: undefined,
  topComitters: [],
  showMenuMode: '_DISABLED_',
  addEditDialogFormAction: null,
  entity: {}
};

class AddEditDialogComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { validationMessages: {}, autocompleteDataSource: [] };
    this.allRefs = [];
  }

  handleOnSubmit(menuMode, editMenuMode, addMenuMode, onSubmit, addEditDialogFormAction, stage, inputTabs) {

    if (this.validate(inputTabs)) {
      const entity = {};

      Object.keys(this.allRefs)
        .forEach((key) => {
          if (key.substr(0, 6) === 'input_') {
            if (this.allRefs[key] instanceof TextField || this.allRefs[key] instanceof LinkTextField) {
              entity[key.substr(6)] = this.allRefs[key].getValue();
            } else if (this.allRefs[key] instanceof Toggle) {
              entity[key.substr(6)] = this.allRefs[key].isToggled();
            } else if (this.allRefs[key] instanceof AutoComplete) {
              entity[key.substr(6)] = this.allRefs[key].getValue();
            } else {
              console.log(`unkown input type ${this.allRefs[key]}`);
            }
          }
        });

      let method;

      if (menuMode === editMenuMode) {
        method = 'PUT';
      } else if (menuMode === addMenuMode) {
        method = 'POST';
      }

      onSubmit(entity, addEditDialogFormAction, method, stage);
    }
  }

  handleOnCancel(onCancel) {
    this.setState({ validationMessages: {} });
    onCancel();
  }

  handleAutocompleteInput(searchText, searchEndpoint) {
    if (searchText && searchText.length > 2) {
      const client = rest.wrap(mime);
      const encodedSearchUri = encodeURI(`${searchEndpoint}?searchQuery=${searchText}`);
      client({ path: encodedSearchUri })
        .then(response => {
          this.setState({
            autocompleteDataSource: response.entity.map((person) => {
              const avatar = person.thumbnailPhoto
                && <Avatar src={`data:image/png;base64,${person.thumbnailPhoto}`}/>;

              return {
                text: person.displayName,
                value: (
                  <MenuItem
                    primaryText={person.displayName}
                    rightAvatar={avatar}
                  />
                )
              };
            })
          });
        });
    } else {
      this.setState({
        autocompleteDataSource: []
      });
    }
  }

  validate(inputTabs) {
    const { validationMessages } = this.state;

    let isValid = true;


    const validate = (key, i) => {
      if (inputTabs[i].inputFields[key].required) {
        if (typeof this.allRefs[`input_${key}`].getValue === 'function') {
          if (!this.allRefs[`input_${key}`].getValue()) {
            validationMessages[key] = 'Field is required!';
            isValid = false;
          }
        }
      }
    };

    for (let i = 0; i < inputTabs.length; i += 1) {
      Object.keys(inputTabs[i].inputFields)
        .forEach((key) => validate(key, i));
    }

    this.setState({ validationMessages });
    return isValid;
  }

  createTextField(options) {
    const { validationMessages, autocompleteDataSource } = this.state;
    const style = { marginLeft: '1em' };

    if (options.multiLine) {
      style.width = '33em';
    }

    if (options.searchEndpoint) {
      return (<AutoComplete
        key={`add_edit_dialog_${options.key}`}
        style={style}
        ref={(ref) => {
          this.allRefs[`input_${options.key}`] = ref;
        }}
        floatingLabelText={options.label}
        hintText={options.hint}
        errorText={validationMessages[options.key]}
        searchText={options.value}
        disabled={options.disabled}
        multiLine={options.multiLine}
        dataSource={autocompleteDataSource}
        onUpdateInput={(searchText) => {
          this.handleAutocompleteInput(searchText, options.searchEndpoint);
        }}
        filter={AutoComplete.caseInsensitiveFilter}
      />);
    } if (options.isLink) {
      return (<LinkTextField
        key={`add_edit_dialog_${options.key}`}
        style={style}
        ref={(ref) => {
          this.allRefs[`input_${options.key}`] = ref;
        }}
        floatingLabelText={options.label}
        hintText={options.hint}
        errorText={validationMessages[options.key]}
        defaultValue={options.value}
        disabled={options.disabled}
      />);
    }
    return (<TextField
      key={`add_edit_dialog_${options.key}`}
      style={style}
      ref={(ref) => {
        this.allRefs[`input_${options.key}`] = ref;
      }}
      floatingLabelText={options.label}
      hintText={options.hint}
      errorText={validationMessages[options.key]}
      defaultValue={options.value}
      disabled={options.disabled}
      multiLine={options.multiLine}
    />);

  }

  render() {
    const {
      entity,
      menuMode,
      addMenuMode,
      entityDisplayName,
      editMenuMode,
      showMenuMode,
      inputTabs,
      topComitters,
      onCancel,
      onSubmit,
      addEditDialogFormAction,
      stage
    } = this.props;

    const { validationMessages } = this.state;

    let actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={() => this.handleOnCancel(onCancel)}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => this.handleOnSubmit(menuMode, editMenuMode, addMenuMode, onSubmit, addEditDialogFormAction, stage, inputTabs)}
      />
    ];

    let isOpen = false;

    let title = '';

    let readOnly = false;

    if (menuMode === addMenuMode) {
      isOpen = true;
      title = `Add ${entityDisplayName}`;
    } else if (menuMode === editMenuMode) {
      isOpen = true;
      title = `Edit ${entity.label}`;
    } else if (menuMode === showMenuMode) {
      isOpen = true;
      title = `Show ${entity.label}`;

      actions = [
        <FlatButton
          label="Close"
          primary
          onClick={() => this.handleOnCancel(onCancel)}
        />
      ];

      readOnly = true;
    } else {
      // dialog is closed, we can short-cut here
      return null;
    }

    const customProperties = Object.keys(entity);

    // pre-defined input field tabs
    const defaultPropertyInputTabs = [];

    for (let i = 0; i < inputTabs.length; i += 1) {

      const inputs = [];
      let hasInvalidInput = false;

      Object.keys(inputTabs[i].inputFields)
        .forEach((key) => {

          if (inputTabs[i].inputFields[key].type === 'toggle') {
            const toggle = inputTabs[i].inputFields[key];

            let value = false;
            if (typeof (entity[key]) === 'boolean') {
              value = entity[key];

              customProperties.splice(customProperties.indexOf(key), 1);
            }

            inputs.push(<Toggle
              key={`add_edit_dialog_${key}`}
              ref={(ref) => {
                this.allRefs[`input_${key}`] = ref;
              }}
              label={toggle.label}
              defaultToggled={value}
              disabled={readOnly}
              style={{ marginTop: '2em', maxWidth: '23em' }}
            />);

          } else {
            // default to "text"

            const textField = inputTabs[i].inputFields[key];

            let value = '';
            if (typeof (entity[key]) === 'string') {
              value = entity[key];

              customProperties.splice(customProperties.indexOf(key), 1);
            }

            inputs.push(this.createTextField({
              key,
              label: textField.label,
              hint: textField.hint,
              multiLine: textField.multiLine,
              value,
              disabled: textField.disabled || readOnly,
              searchEndpoint: textField.searchEndpoint,
              isLink: textField.isLink
            }));

            if (validationMessages[key]) {
              hasInvalidInput = true;
            }
          }
        });

      let tabstyle;

      if (hasInvalidInput) {
        tabstyle = { color: 'rgb(244, 67, 54)' };
      }
      const tab =
        <Tab
          key={`add_edit_dialog_tab_${i}`}
          label={inputTabs[i].label}
          style={tabstyle}
        >
          {inputs}
        </Tab>;
      defaultPropertyInputTabs
        .push(tab);
    }

    // custom input field tab (contains all properties defined for entity that are _not_ included in pre-defined input fields)
    let customPropertiesTab;

    if (customProperties.length > 0) {
      const customPropertyInputs = [];

      Object.keys(customProperties)
        .forEach((idx) => {
          const key = customProperties[idx];

          if (typeof (entity[key]) === 'string') {
            customPropertyInputs.push(this.createTextField({
              key,
              label: key,
              hint: key,
              value: entity[key],
              disabled: readOnly
            }));
          } else if (typeof (entity[key]) === 'boolean') {
            customPropertyInputs.push(<Toggle
              ref={(ref) => {
                this.allRefs[`input_${key}`] = ref;
              }}
              label={key}
              defaultToggled={entity[key]}
              disabled={readOnly}
              style={{ marginTop: '2em', maxWidth: '23em' }}
            />);
          } else {
            console.log(`unkown property type for key "${key}" with value "${JSON.stringify(entity[key])}"`);
          }
        });

      customPropertiesTab = (
        <Tab
          key="add_edit_dialog_tab_custom_props"
          label="Misc"
        >
          {customPropertyInputs}
        </Tab>);
    }

    // bitbucket top comitters tab
    let topComittersTab;

    if (Array.isArray(topComitters)) {
      const topComittersList = [];
      topComitters.forEach((propValue, index) => {
        topComittersList.push(<ListItem
          key={`${entity.id}_bitbucket_${index}`}
          primaryText={propValue.emailAddress}
          secondaryText={propValue.numberOfCommits}
        />);
      });

      topComittersTab = (
        <Tab
          key="add_edit_dialog_tab_top_committers"
          label="Top Committers"
        >
          <List>
            {topComittersList}
          </List>
        </Tab>);
    }

    return (
      <Dialog
        title={title}
        actions={actions}
        modal
        open={isOpen}
        repositionOnUpdate={false}
      >
        <Tabs>
          {defaultPropertyInputTabs}
          {topComittersTab}
          {customPropertiesTab}
        </Tabs>
      </Dialog>
    );
  }
}

AddEditDialogComponent.defaultProps = defaultProps;
AddEditDialogComponent.propTypes = propTypes;

export default AddEditDialogComponent;
