import sinon from 'sinon';
import React from 'react';
import chai from 'chai';
import { shallow } from 'enzyme';
import { StageSelector } from '../../../main/javascript/components/stageSelector';

function createProps() {
  return {
    onStageSelected: sinon.spy(),
    stage: 'dev',
    availableStages: []
  };
}

describe('<StageSelector/>', () => {

  it('shows drop-down box with all available stages, pre-selects "stage" prop', () => {
    const props = createProps();
    props.availableStages = ['foo', 'bar', 'baz'];
    props.stage = 'bar';

    const wrapper = shallow(<StageSelector {...props}/>);

    chai.expect(wrapper.find('MenuItem').length).to.equal(3);
    chai.expect(wrapper.props().value).to.equal(1);
  });

  it('calls onStageSelected with the name of the selected stage', () => {
    const props = createProps();
    props.availableStages = ['foo', 'bar', 'baz'];
    props.stage = 'foo';

    const wrapper = shallow(<StageSelector {...props}/>);

    wrapper.simulate('change', undefined, undefined, 2);

    sinon.assert.calledOnce(props.onStageSelected);
    sinon.assert.calledWith(props.onStageSelected, 'baz');
  });
});

