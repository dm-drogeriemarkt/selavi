import { connect } from 'react-redux';
import onStageSelected from '../actions/stageSelectorActions';
import StageSelectorComponent from './stageSelector.component';

const mapStateToProps = (state) => ({
  stage: state.stage,
  availableStages: state.availableStages
});

const mapDispatchToProps = {
  onStageSelected
};


const StageSelector = connect(mapStateToProps, mapDispatchToProps)(StageSelectorComponent);
export default StageSelector;
