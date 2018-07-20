import { connect } from 'react-redux';
import MicroserviceCountLabelComponent from './microserviceCountLabel.component';

const mapStateToProps = (state) => ({
  microservices: state.app.microservices,
  hiddenMicroServices: state.app.hiddenMicroServices
});

const MicroserviceCountLabel = connect(mapStateToProps)(MicroserviceCountLabelComponent);
export default MicroserviceCountLabel;
