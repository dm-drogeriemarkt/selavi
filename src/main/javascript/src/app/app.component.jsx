import 'babel-polyfill';
import React from 'react';
import MicroserviceFilterBox from 'components/microserviceFilterbox/microserviceFilterbox';
import MicroserviceMindmap from 'components/microserviceMindmap/microserviceMindmap';
import MicroserviceSnackbar from 'components/microserviceSnackbar/microserviceSnackbar';
import AddEditDialog from 'components/addEditDialog/addEditDialog';
import MicroserviceDeleteServiceDialog from 'components/microserviceDeleteServiceDialog/microserviceDeleteServiceDialog';
import LoginDialog from 'components/loginDialog/loginDialog';
import PropTypes from 'prop-types';
import { getRequiredPropertyNames } from 'shared/requiredPropertyUtil';

const propTypes = {
  fetchAvailableStages: PropTypes.func.isRequired,
  fetchMicroservices: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  stage: PropTypes.string
};

const defaultProps = {
  stage: undefined
};

class App extends React.Component {

  componentDidMount() {
    this.props.fetchAvailableStages();
    this.props.login();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stage !== this.props.stage) {
      this.props.fetchMicroservices(this.props.stage);
    }
  }

  render() {
    const serviceBusinessInputFields = {
      id: { label: 'Service ID *', hint: 'eg. "ZOE"', required: true },
      label: { label: 'Label *', hint: 'eg. "ZOE"', required: true },
      version: { label: 'Version *', hint: 'eg. "1.0.1"', required: false },
      fdOwner: {
        label: 'Contact Person *',
        hint: 'eg. "Altmann, Erik"',
        required: true,
        searchEndpoint: '/selavi/person/search'
      },
      tags: { label: 'Tags', hint: 'eg. "dm-pos-belege, produktdaten"', required: false },
      description: {
        label: 'Description *',
        hint: 'eg. "ZKDB Online Echtzeitf\u00e4hig"',
        required: true,
        multiLine: true
      }
    };

    const serviceTechInputFields = {
      microserviceUrl: { label: 'URL', hint: 'eg. "https://example.organization.de"', required: false },
      ipAddress: { label: 'IP address(es)', hint: 'eg. "172.23.68.213"', required: false },
      networkZone: { label: 'Network zone', hint: 'eg. "LAN"', required: false },
      external: { type: 'toggle', label: 'External service (eg., not a microservice)' }
    };

    const serviceDocumentationInputFields = {
      documentationLink: {
        label: 'Link to documentation *',
        hint: 'eg. "https://wiki.example.de/ZOE"',
        required: true,
        isLink: true
      },
      buildMonitorLink: {
        label: 'Link to Build Monitor',
        hint: 'eg. "https://example-jenkins.organization.de"',
        required: false,
        isLink: true
      },
      monitoringLink: {
        label: 'Link to Monitoring',
        hint: 'eg. "https://kibana.organization.de"',
        required: false,
        isLink: true
      },
      bitbucketUrl: {
        label: 'Bitbucket URL *',
        hint: 'eg. "https://stash.example.de/projects/ZOE/repos/zoe"',
        required: true,
        isLink: true
      }
    };


    const serviceInputTabs = [
      { label: 'Business', inputFields: serviceBusinessInputFields },
      { label: 'Technical', inputFields: serviceTechInputFields },
      { label: 'Documentation', inputFields: serviceDocumentationInputFields }
    ];

    const serviceRequiredProperties = getRequiredPropertyNames(serviceInputTabs);

    const relationBasicFields = {
      target: { label: 'Consumed service', required: true, disabled: true },
      type: { label: 'Type of relation', hint: 'eg. "REST", "SOAP"', required: false }
    };

    const relationInputTabs = [
      { label: 'Basic', inputFields: relationBasicFields }
    ];

    return (
      <div className="appcontainer">
        <div className="appheader">
          <MicroserviceFilterBox serviceRequiredProperties={serviceRequiredProperties}/>
        </div>
        <div className="appcontent">
          <MicroserviceMindmap serviceRequiredProperties={serviceRequiredProperties}/>
        </div>
        <div className="appfooter">
          <MicroserviceSnackbar/>
          <AddEditDialog
            inputTabs={serviceInputTabs}
            addMenuMode="ADD_SERVICE"
            editMenuMode="EDIT_SERVICE"
            showMenuMode="SHOW_SERVICE"
            entityDisplayName="Service"
          />
          <AddEditDialog
            inputTabs={relationInputTabs}
            addMenuMode="ADD_RELATION"
            editMenuMode="EDIT_RELATION"
            entityDisplayName="Link"
          />
          <MicroserviceDeleteServiceDialog/>
          <LoginDialog/>
        </div>
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;

