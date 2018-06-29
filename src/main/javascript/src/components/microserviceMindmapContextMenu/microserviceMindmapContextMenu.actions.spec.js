import chai from 'chai';
import {
  onAddProperty,
  onDeleteLink,
  onDeleteService,
  onEditLink,
  onShowService
} from './microserviceMindmapContextMenu.actions';

describe('microserviceMindmapContextMenuActions', () => {
  it('onAddProperty dispatches EDIT_SERVICE', () => {
    const result = onAddProperty();

    chai.expect(result.type).to.equal('EDIT_SERVICE');
  });

  it('onDeleteService dispatches DELETE_SERVICE', () => {
    const result = onDeleteService();

    chai.expect(result.type).to.equal('DELETE_SERVICE');
  });

  it('onDeleteLink dispatches DELETE_LINK', () => {
    const result = onDeleteLink();

    chai.expect(result.type).to.equal('DELETE_LINK');
  });

  it('onEditLink dispatches EDIT_LINK', () => {
    const result = onEditLink();

    chai.expect(result.type).to.equal('EDIT_LINK');
  });

  it('onShowService dispatches SHOW_SERVICE', () => {
    const result = onShowService();

    chai.expect(result.type).to.equal('SHOW_SERVICE');
  });
});
