var sinon = require('sinon');

import React from "react";
import chai from "chai";
import {shallow} from "enzyme";
import {MicroserviceDeleteServiceDialog} from "../../../main/javascript/components/microserviceDeleteServiceDialog";

describe('<MicroserviceDeleteServiceDialog/>', function () {

    it('is hidden when menuMode is anything but DELETE_SERVICE', function () {
        const props = createProps();

        const wrapper = shallow(<MicroserviceDeleteServiceDialog {...props}/>);

        chai.expect(wrapper.type()).to.equal('div');

        chai.expect(wrapper.find('Dialog').props().open).to.equal(false);
        chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
    });

    it('displays delete confirmation dialog when menuMode is DELETE_SERVICE', function () {
        const props = createProps();

        props.menuMode = 'DELETE_SERVICE';
        props.deleteServiceId = 'foobar'

        const wrapper = shallow(<MicroserviceDeleteServiceDialog {...props}/>);

        chai.expect(wrapper.find('Dialog').props().open).to.equal(true);
        chai.expect(wrapper.find('Dialog').props().title).to.equal('Confirm deletion of service with id foobar');
        chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
    });

    it('displays error message when deleteServiceErrorMessage is set', function () {
        const props = createProps();

        props.menuMode = 'DELETE_SERVICE';

        props.deleteServiceErrorMessage = 'thats an error';

        const wrapper = shallow(<MicroserviceDeleteServiceDialog {...props}/>);

        chai.expect(wrapper.find('Dialog').props().open).to.equal(true);
        chai.expect(wrapper.find('Snackbar').props().open).to.equal(true);
        chai.expect(wrapper.find('Snackbar').props().message).to.equal('thats an error');
    });

    it('does not display error message when menuMode is anything but DELETE_SERVICE', function () {
        const props = createProps();

        props.deleteServiceErrorMessage = 'thats an error';

        const wrapper = shallow(<MicroserviceDeleteServiceDialog {...props}/>);

        chai.expect(wrapper.find('Dialog').props().open).to.equal(false);
        chai.expect(wrapper.find('Snackbar').props().open).to.equal(false);
    });
});

function createProps() {
    const props = {
        onCancel: sinon.spy(),
        onSubmit: sinon.spy(),
        menuMode: undefined,
        deleteServiceId: undefined,
        deleteServiceErrorMessage: undefined
    };

    return props;
}
