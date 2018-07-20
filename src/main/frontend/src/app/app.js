import { connect } from 'react-redux';
import AppComponent from './app.component';
import { actionCreator } from 'shared/actionHelper';

const mapStateToProps = (state) => ({
  stage: state.app.stage,
  stages: state.app.stages
});


const mapDispatchToProps = dispatch => ({
  fetchAvailableStages: () => {
    dispatch(actionCreator('FETCH_AVAILABLE_STAGES_REQUESTED'));
  },
  fetchMicroservices: (stage) => {
    dispatch(actionCreator('FETCH_MICROSERVICES_REQUESTED', stage));
  },
  login: (options) => {
    dispatch(actionCreator('LOGIN_REQUESTED', options));
  }
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
export default App;
