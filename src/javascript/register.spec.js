jest.mock('@jahia/ui-extender', () => {
    return {
        registry: {
            add: jest.fn(),
            addOrReplace: jest.fn(),
            get: jest.fn()
        }
    };
});

import {registry} from '@jahia/ui-extender';

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

    it('should register content editor', () => {
        expect(
            registry
                .add
                .mock
                .calls
                .find(call => call[1] === 'content-editor')
        )
            .toBeTruthy();
    });
});
