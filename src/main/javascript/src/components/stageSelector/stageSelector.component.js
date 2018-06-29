import React from 'react';
import PropTypes from 'prop-types';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


const propTypes = {
  onStageSelected: PropTypes.func.isRequired,
  availableStages: PropTypes.array.isRequired,
  stage: PropTypes.string
};

const defaultProps = {
  stage: undefined
};

class StageSelectorComponent extends React.Component {

  onChangeHandler(value) {
    const { onStageSelected, availableStages } = this.props;
    onStageSelected(availableStages[value]);
  }

  render() {
    const { availableStages, stage } = this.props;
    const menuItems = availableStages.map((mappingStage, index) => <MenuItem
      value={index}
      primaryText={mappingStage}
      key={`stage_selector_item_${index}`}
    />);
    const selectedStageIndex = availableStages.indexOf(stage);

    return (
      <DropDownMenu
        style={{
          zIndex: 999, position: 'absolute', top: '0.5em', right: '0.5em'
        }}
        value={selectedStageIndex}
        onChange={(event, key, value) => this.onChangeHandler(value)}
      >
        {menuItems}
      </DropDownMenu>
    );
  }
}

StageSelectorComponent.propTypes = propTypes;
StageSelectorComponent.defaultProps = defaultProps;


export default StageSelectorComponent;
