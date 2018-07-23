/* eslint-disable react/destructuring-assignment */
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import React from 'react';
import { mount, shallow } from 'enzyme';
import PropTypes from 'prop-types';
import AddEditDialogComponent from 'components/addEditDialog/addEditDialog.component';

jest.mock('rest');

function createProps() {
  return {
    menuMode: undefined,
    inputTabs: [],
    editMenuMode: undefined,
    onCancel: jest.fn(),
    onSubmit: jest.fn()
  };
}

describe('<AddEditDialogComponent/>', () => {

  it('renders tabs with text fields for all elements in inputTabs prop', () => {

    const props = createProps();

    props.inputTabs = [{
      label: 'my_input_tab',
      inputFields: {
        id: { label: 'Service ID *', hint: 'eg. "ZOE"', required: true },
        label: { label: 'Label *', hint: 'eg. "ZOE"', required: true }
      }
    }];

    const wrapper = shallow(<AddEditDialogComponent {...props}/>);


    expect(wrapper.find('Tab').length).to.equal(2);
    expect(wrapper.find('Tab').at(0).props().label).to.equal('my_input_tab');

    expect(wrapper.find('TextField').length).to.equal(2);

    expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal('Service ID *');
    expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal('');

    expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal('Label *');
    expect(wrapper.find('TextField').at(1).props().defaultValue).to.equal('');
  });

  it('renders text fields for fields in selected service, and sets their default values', () => {

    const props = createProps();
    props.entity = {
      id: 'bar-consumer',
      label: 'bar-consumer',
      external: true,
      consumes: [
        'foo-service'
      ]
    };
    props.menuMode = 'MY_MENU_MODE';
    props.editMenuMode = 'MY_MENU_MODE';

    const wrapper = shallow(<AddEditDialogComponent {...props}/>);

    expect(wrapper.find('TextField').length).to.equal(2);
    expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal('id');
    expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal('bar-consumer');

    expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal('label');
    expect(wrapper.find('TextField').at(1).props().defaultValue).to.equal('bar-consumer');
  });

  it('mixes pre-defined and dynamic fields / properties', () => {

    const props = createProps();
    props.inputTabs = [{
      label: 'my_input_tab',
      inputFields: {
        id: { label: 'Service ID *', hint: 'eg. "ZOE"', required: true },
        label: { label: 'Label *', hint: 'eg. "ZOE"', required: true }
      }
    }];
    props.entity = {
      id: 'bar-consumer',
      label: 'bar-consumer',
      external: true,
      consumes: [
        'foo-service'
      ]
    };
    props.menuMode = 'MY_MENU_MODE';
    props.editMenuMode = 'MY_MENU_MODE';

    const wrapper = shallow(<AddEditDialogComponent {...props}/>);

    expect(wrapper.find('TextField').length).to.equal(2);

    expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal('Service ID *');
    expect(wrapper.find('TextField').at(0).props().defaultValue).to.equal('bar-consumer');

    expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal('Label *');
    expect(wrapper.find('TextField').at(1).props().defaultValue).to.equal('bar-consumer');
  });

  it('renders disabled text fields', () => {

    const props = createProps();
    props.inputTabs = [{
      label: 'my_input_tab',
      inputFields: {
        id: {
          label: 'Service ID *', hint: 'eg. "ZOE"', required: true, disabled: true
        },
        label: { label: 'Label *', hint: 'eg. "ZOE"', required: true }
      }
    }];

    const wrapper = shallow(<AddEditDialogComponent {...props}/>);

    expect(wrapper.find('TextField').length).to.equal(2);

    expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal('Service ID *');
    expect(wrapper.find('TextField').at(0).props().disabled).to.equal(true);

    expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal('Label *');
    expect(wrapper.find('TextField').at(1).props().disabled).to.equal(false);
  });

  it('disables all input fields when menuMode is SHOW_SERVICE', () => {

    const props = createProps();
    props.inputTabs = [{
      label: 'my_input_tab',
      inputFields: {
        id: { label: 'Service ID *', hint: 'eg. "ZOE"', required: true },
        label: { label: 'Label *', hint: 'eg. "ZOE"', required: true }
      }
    }];
    props.menuMode = 'SHOW_SERVICE';
    props.showMenuMode = 'SHOW_SERVICE';

    const wrapper = shallow(<AddEditDialogComponent {...props}/>);

    expect(wrapper.find('TextField').length).to.equal(2);

    expect(wrapper.find('TextField').at(0).props().floatingLabelText).to.equal('Service ID *');
    expect(wrapper.find('TextField').at(0).props().disabled).to.equal(true);

    expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal('Label *');
    expect(wrapper.find('TextField').at(1).props().disabled).to.equal(true);
  });

  it('displays "show..." as title when menuMode is SHOW_SERVICE', () => {

    const props = createProps();
    props.menuMode = 'SHOW_SERVICE';
    props.showMenuMode = 'SHOW_SERVICE';
    props.entity = {
      label: 'hello_world'
    };

    const wrapper = shallow(<AddEditDialogComponent {...props}/>);

    expect(wrapper.find('Dialog').props().title).to.equal('Show hello_world');
  });


  it('renders multi-line text fields', () => {

    const props = createProps();
    props.inputTabs = [{
      label: 'my_input_tab',
      inputFields: {
        id: { label: 'Service ID *', hint: 'eg. "ZOE"', required: true },
        label: {
          label: 'Label *', hint: 'eg. "ZOE"', required: true, multiLine: true
        }
      }
    }];

    const wrapper = shallow(<AddEditDialogComponent {...props}/>);

    expect(wrapper.find('TextField').length).to.equal(2);

    expect(wrapper.find('TextField').at(1).props().floatingLabelText).to.equal('Label *');
    expect(wrapper.find('TextField').at(1).props().multiLine).to.equal(true);
    expect(wrapper.find('TextField').at(1).props().style.width).to.equal('33em');
  });

  it('renders link text fields', () => {

    const props = createProps();
    props.inputTabs = [{
      label: 'my_input_tab',
      inputFields: {
        id: { label: 'Service ID *', hint: 'eg. "ZOE"', required: true },
        label: {
          label: 'Label *', hint: 'eg. "ZOE"', required: true, isLink: true
        }
      }
    }];

    const wrapper = shallow(<AddEditDialogComponent {...props}/>);

    expect(wrapper.find('LinkTextField').length).to.equal(1);
    expect(wrapper.find('LinkTextField').at(0).props().floatingLabelText).to.equal('Label *');
  });

  it('validates text fields with required=true on submit', () => {

    const props = createProps();
    props.inputTabs = [{
      label: 'my_input_tab',
      inputFields: {
        id: { label: 'Service ID *', hint: 'eg. "ZOE"', required: true },
        label: { label: 'Label *', hint: 'eg. "ZOE"', required: true }
      }
    }];

    const wrapper = mount(<AddEditDialogComponent {...props}/>, {
      context: {
        muiTheme: getMuiTheme()
      },
      childContextTypes: {
        muiTheme: PropTypes.object.isRequired
      }
    });

    wrapper.instance()
      .handleOnSubmit();

    expect(wrapper.state().validationMessages.id).to.equal('Field is required!');
    expect(wrapper.state().validationMessages.label).to.equal('Field is required!');

    expect(wrapper.instance().allRefs.input_id.props.errorText).to.equal('Field is required!');
    expect(wrapper.instance().allRefs.input_label.props.errorText).to.equal('Field is required!');
  });

  xit('marks tabs containing invalid fields', () => {

    const props = createProps();
    props.inputTabs = [{
      label: 'my_valid_tab',
      inputFields: {
        id: { label: 'Service ID *', hint: 'eg. "ZOE"', required: false }
      }
    },
    {
      label: 'my_invalid_tab',
      inputFields: {
        label: { label: 'Label *', hint: 'eg. "ZOE"', required: true }
      }
    }];

    const wrapper = mount(<AddEditDialogComponent {...props}/>, {
      context: {
        muiTheme: getMuiTheme()
      },
      childContextTypes: {
        muiTheme: PropTypes.object.isRequired
      }
    });

    wrapper.instance()
      .handleOnSubmit();

    // TODO: fix this test
    // currently, its not possible to test anything on the children of material ui's Dialog component (eg, the Tab)
    // when using enzyme's mount(): https://github.com/callemall/material-ui/issues/6290

    expect(wrapper.find('Tab').length).to.equal(2);
    expect(wrapper.find('Tab').at(0).props().style).to.be.undefined;
    expect(wrapper.find('Tab').at(1).style).to.equal({ color: 'rgb(244, 67, 54)' });
  });

  it('creates entity object and calls props.onSubmit() when validation succeeds', () => {

    const props = createProps();
    props.inputTabs = [{
      label: 'my_input_tab',
      inputFields: {
        id: { label: 'Service ID *', hint: 'eg. "ZOE"', required: true },
        label: { label: 'Label *', hint: 'eg. "ZOE"', required: true }
      }
    }];
    props.entity = {
      id: 'foo',
      label: 'bar'
    };
    props.addEditDialogFormAction = '/myBackendUrl';

    const wrapper = mount(<AddEditDialogComponent {...props}/>, {
      context: {
        muiTheme: getMuiTheme()
      },
      childContextTypes: {
        muiTheme: PropTypes.object.isRequired
      }
    });

    wrapper.instance()
      .handleOnSubmit();

    expect(props.onSubmit).toBeCalledOnce();
    expect(props.onSubmit)({ id: 'foo', label: 'bar' }, '/myBackendUrl', 'PUT').toBeCalledWith();
  });

  it('renders bitbucket top comitters in separate tab, when present', () => {

    const props = createProps();
    props.topComitters = [
      {
        emailAddress: 'foo@bar.baz',
        numberOfCommits: 42
      },
      {
        emailAddress: 'moo@cow.biz',
        numberOfCommits: 1337
      }
    ];

    const wrapper = shallow(<AddEditDialogComponent {...props}/>);

    expect(wrapper.find('Tab').length).to.equal(1);
    expect(wrapper.find('Tab').at(0).props().label).to.equal('Top Committers');
    expect(wrapper.find('Tab').at(0).find('ListItem').length).to.equal(2);

    expect(wrapper.find('Tab').at(0).find('ListItem').at(0).props().primaryText).to.equal('foo@bar.baz');
    expect(wrapper.find('Tab').at(0).find('ListItem').at(0).props().secondaryText).to.equal(42);
    expect(wrapper.find('Tab').at(0).find('ListItem').at(1).props().primaryText).to.equal('moo@cow.biz');
    expect(wrapper.find('Tab').at(0).find('ListItem').at(1).props().secondaryText).to.equal(1337);
  });

});
