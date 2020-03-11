jest.mock('react-router-dom', () => {
    return {useHistory: jest.fn()};
});
import {useContentEditorHistory} from '~/ContentEditorHistory';
import {useHistory} from 'react-router-dom';

describe('redirect test', () => {
    let pushHistory;
    let pathmame;
    beforeEach(() => {
        pushHistory = jest.fn();
        useHistory.mockImplementation(() => {
            return {push: pushHistory, location: {pathname: pathmame}};
        });
    });
    const tests = [
        {
            pathname: '/jcontent/systemsite/en/pages/contents',
            input: {mode: 'edit', language: 'en', uuid: 'this-is-my-uuid'},
            result: '/content-editor/en/edit/this-is-my-uuid'
        },
        {
            pathname: '/jcontent/systemsite/en/pages',
            input: {mode: 'create', language: 'en', uuid: 'this-is-my-uuid', rest: 'withoutPath'},
            result: '/content-editor/en/create/this-is-my-uuid/withoutPath'
        },
        {
            pathname: '/jcontent/systemsite/en/pages',
            input: {mode: 'create', language: 'en', uuid: 'this-is-my-uuid', rest: '/withoutPath'},
            result: '/content-editor/en/create/this-is-my-uuid/withoutPath'
        },
        {
            pathname: '/jcontent/systemsite/en/pages',
            input: {mode: 'create', language: 'en', uuid: 'this-is-my-uuid', rest: '/with/path'},
            result: '/content-editor/en/create/this-is-my-uuid/with/path'
        },
        {
            pathname: '/jcontent/systemsite/en/pages',
            input: {mode: 'edit', language: 'en', uuid: 'this-is-my-uuid', rest: ''},
            result: '/content-editor/en/edit/this-is-my-uuid'
        },
        {
            pathname: '/content-editor/en/create/this-is-my-uuid/withoutPath',
            input: {mode: 'edit'},
            result: '/content-editor/en/edit/this-is-my-uuid'
        },
        {
            pathname: '/content-editor/en/create/this-is-my-uuid/withoutPath',
            input: {language: 'fr'},
            result: '/content-editor/fr/create/this-is-my-uuid/withoutPath'
        },
        {
            pathname: '/content-editor/en/create/this-is-my-uuid/withoutPath',
            input: {uuid: 'new-uuid'},
            result: '/content-editor/en/create/new-uuid/withoutPath'
        },
        {
            pathname: '/content-editor/en/create/this-is-my-uuid/withoutPath',
            input: {rest: ''},
            result: '/content-editor/en/create/this-is-my-uuid'
        },
        {
            pathname: '/content-editor/en/create/this-is-my-uuid/withoutPath',
            input: {rest: 'withoutNewPath'},
            result: '/content-editor/en/create/this-is-my-uuid/withoutNewPath'
        },
        {
            pathname: '/content-editor/en/create/this-is-my-uuid/withoutPath',
            input: {rest: '/withoutNewPath'},
            result: '/content-editor/en/create/this-is-my-uuid/withoutNewPath'
        },
        {
            pathname: '/content-editor/en/create/this-is-my-uuid/withoutPath',
            input: {rest: '/with/new/path'},
            result: '/content-editor/en/create/this-is-my-uuid/with/new/path'
        }

    ];

    tests.forEach(test => {
        it(`should redirect properly ${test.pathname} to ${test.result}`, () => {
            pathmame = test.pathname;
            const {redirect} = useContentEditorHistory();
            redirect(test.input);
            expect(pushHistory).toHaveBeenCalledWith(test.result);
        });
    });
});
