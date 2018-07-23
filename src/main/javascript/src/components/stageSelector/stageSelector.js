import { connect } from 'react-redux';
import onStageSelected from './stageSelector.actions';
import StageSelectorComponent from './stageSelector.component';

const mapStateToProps = (state) => ({
  stage: state.app.stage,
  availableStages: state.app.availableStages
});

const mapDispatchToProps = {
  onStageSelected
};


const StageSelector = connect(mapStateToProps, mapDispatchToProps)(StageSelectorComponent);
export default StageSelector;
