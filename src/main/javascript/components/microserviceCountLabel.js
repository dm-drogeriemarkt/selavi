import { connect } from 'react-redux';
import MicroserviceCountLabelComponent from './microserviceCountLabel.component';

const mapStateToProps = (state) => ({
  microservices: state.microservices,
  hiddenMicroServices: state.hiddenMicroServices
});

const MicroserviceCountLabel = connect(mapStateToProps)(MicroserviceCountLabelComponent);
export default MicroserviceCountLabel;
