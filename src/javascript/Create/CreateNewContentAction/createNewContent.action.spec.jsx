import createNewContentAction from './createNewContent.action';

describe('createNewContent action', () => {
    it('should call renderComponent when clicnking', () => {
        const renderComponent = jest.fn();
        createNewContentAction.onClick({renderComponent});

        expect(renderComponent).toHaveBeenCalled();
    });
});
