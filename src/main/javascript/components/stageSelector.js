import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import onStageSelected from './../actions/stageSelectorActions';

const mapStateToProps = (state) => ({
  stage: state.stage,
  availableStages: state.availableStages
});

const mapDispatchToProps = {
  onStageSelected
};

const propTypes = {
  onStageSelected: PropTypes.func.isRequired,
  availableStages: PropTypes.array.isRequired,
  stage: PropTypes.string.isRequired
};

export class StageSelectorComponent extends React.Component {

  onChangeHandler(value) {
    this.props.onStageSelected(this.props.availableStages[value]);
  }

  render() {

    const menuItems = this.props.availableStages.map((stage, index) => <MenuItem
      value={index}
      primaryText={stage}
      key={`stage_selector_item_${index}`}
    />);
    const selectedStageIndex = this.props.availableStages.indexOf(this.props.stage);

    return (
      <DropDownMenu
        style={{ zIndex: 999, position: 'absolute', top: '0.5em', right: '0.5em' }}
        value={selectedStageIndex}
        onChange={(event, key, value) => this.onChangeHandler(value)}
      >
        {menuItems}
      </DropDownMenu>
    );
  }
}

StageSelectorComponent.propTypes = propTypes;


const StageSelector = connect(mapStateToProps, mapDispatchToProps)(StageSelectorComponent);
export default StageSelector;
