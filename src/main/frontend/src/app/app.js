import { connect } from 'react-redux';
import AppComponent from './app.component';
import { actionCreator } from 'shared/actionHelper';

const mapStateToProps = (state) => ({
  stage: state.stage,
  stages: state.stages
});


const mapDispatchToProps = dispatch => ({
  fetchAvailableStages: () => {
    dispatch(actionCreator('FETCH_AVAILABLE_STAGES_REQUESTED'));
  },
  fetchMicroservices: () => {
    dispatch(actionCreator('FETCH_MICROSERVICES_REQUESTED'));
  },
  login: () => {
    dispatch(actionCreator('LOGIN_REQUESTED'));
  }
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
export default App;
