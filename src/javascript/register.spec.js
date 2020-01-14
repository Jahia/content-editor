jest.mock('@jahia/registry', () => {
    return {
        registry: {
            add: jest.fn()
        }
    };
});

import {registry} from '@jahia/registry';

describe('register', () => {
    let actionsRegistry;
    beforeAll(() => {
        window.parent.authoringApi = {
            getEditTabs: jest.fn()
        };

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

        console.debug = jest.fn();
        require('./register.jsx');
    });

    it('should register create route', () => {
        expect(
            registry
                .add
                .mock
                .calls
                .find(call => call[0] === 'create-route')
        )
            .toBeTruthy();
    });

    it('should register edit route', () => {
        expect(
            registry
                .add
                .mock
                .calls
                .find(call => call[0] === 'edit-route')
        )
            .toBeTruthy();
    });
});
