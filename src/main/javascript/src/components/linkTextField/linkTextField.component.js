import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';
import { grey300 } from 'material-ui/styles/colors';

const propTypes = {
  defaultValue: PropTypes.string.isRequired
};

class LinkTextField extends React.Component {

  constructor(props) {
    super(props);
    this.state = { linkActive: !!props.defaultValue };
    this.textfieldRef = undefined;
  }

  onChange(event) {
    this.setState({ linkActive: !!event.target.value });
  }

  onTouchTap() {
    const value = this.textfieldRef.getValue();
    if (value) {
      window.open(value);
    }
  }

  render() {
    const { linkActive } = this.state;
    const textFieldProps = {
      ...this.props,
      ref: (ref) => {
        this.textfieldRef = ref;
      }
    };
    textFieldProps.style.width = '31em';

    const buttonProps = {};
    const iconProps = {
      onTouchTap: () => this.onTouchTap()
    };

    if (!linkActive) {
      iconProps.color = grey300;
    } else {
      buttonProps.tooltip = 'Open link...';
    }

    return (
      <div>
        <TextField {...textFieldProps} id="usefull" onChange={() => this.onChange()}/>
        <IconButton {...buttonProps}>
          <OpenInNew {...iconProps}/>
        </IconButton>
      </div>
    );
  }
}

LinkTextField.propTypes = propTypes;

export default LinkTextField;
