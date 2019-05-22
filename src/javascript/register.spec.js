jest.mock('./actions/publishAction', () => {
    return {

    };
});

jest.mock('./actions/unpublishAction', () => {
    return {

    };
});

const publishAction = require('./actions/publishAction');
const unpublishAction = require('./actions/unpublishAction');
const {unsetFieldAction} = require('./actions/unsetFieldAction');

describe('register', () => {
    let actionsRegistry;
    beforeAll(() => {
        actionsRegistry = {
            get: jest.fn(),
            add: jest.fn()
        };
        global.contextJsParameters = {
            config: {
                actions: {
                    push: jest.fn(fn => fn(actionsRegistry))
                }
            },
            i18nNamespaces: {
                push: jest.fn()
            }
        };

        // eslint-disable-next-line
        global.__webpack_public_path__ = '';

        console.log = jest.fn();
        require('./register.jsx');
    });

    it('should register publish action', () => {
        expect(
            actionsRegistry
                .add
                .mock
                .calls
                .find(call => call[1] === publishAction)
        )
            .toBeTruthy();
    });

    it('should register unpublish action', () => {
        expect(
            actionsRegistry
                .add
                .mock
                .calls
                .find(call => call[1] === unpublishAction)
        )
            .toBeTruthy();
    });

    it('should register unset action', () => {
        expect(
            actionsRegistry
                .add
                .mock
                .calls
                .find(call => call[1] === unsetFieldAction)
        )
            .toBeTruthy();
    });
});
