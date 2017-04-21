import chai from 'chai';

import { onAddProperty, onDeleteService, onDeleteLink, onEditLink } from '../../../main/javascript/actions/microserviceMindmapContextMenuActions';

describe('microserviceMindmapContextMenuActions', function () {
    it('onAddProperty dispatches EDIT_SERVICE', function() {
        const result = onAddProperty();

        chai.expect(result.type).to.equal('EDIT_SERVICE');
    });

    it('onDeleteService dispatches DELETE_SERVICE', function() {
        const result = onDeleteService();

        chai.expect(result.type).to.equal('DELETE_SERVICE');
    });

    it('onDeleteLink dispatches DELETE_LINK', function() {
        const result = onDeleteLink();

        chai.expect(result.type).to.equal('DELETE_LINK');
    });

    it('onEditLink dispatches EDIT_LINK', function() {
        const result = onEditLink();

        chai.expect(result.type).to.equal('EDIT_LINK');
    });
});