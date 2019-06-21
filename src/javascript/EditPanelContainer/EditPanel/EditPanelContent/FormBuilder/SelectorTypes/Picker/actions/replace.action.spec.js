import {replaceAction} from './replace.action';

describe('replaceAction', () => {
    it('should open modal when clicking on it', () => {
        const open = jest.fn();
        replaceAction.onClick({open});

        expect(open).toHaveBeenCalledWith(true);
    });
});
