jest.mock('~Edit/publish/publish.action', () => {
    return {};
});

jest.mock('~Edit/unpublish/unpublish.action', () => {
    return {};
});

const publishAction = require('~Edit/publish/publish.action');
const unpublishAction = require('~Edit/unpublish/unpublish.action');

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
});
