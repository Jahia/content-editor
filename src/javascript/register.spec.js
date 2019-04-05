jest.mock('./actions/publishAction', () => {
    return {

    };
});

const publishAction = require('./actions/publishAction');

describe('register', () => {
    let actionsRegistry;
    beforeEach(() => {
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
    });

    it('should register publish action', () => {
        require('./register.jsx');

        expect(
            actionsRegistry
                .add
                .mock
                .calls
                .find(call => call[1] === publishAction)
        )
            .toBeTruthy();
    });
});
