import {useDialogPickerContent} from './useDialogPickerContent';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useQuery} from '@apollo/react-hooks';

jest.mock('~/ContentEditor.context', () => ({
    useContentEditorContext: jest.fn()
}));

jest.mock('@apollo/react-hooks', () => {
    return {
        useQuery: jest.fn()
    };
});

describe('useDialogPickerContent', () => {
    let option;
    beforeEach(() => {
        useQuery.mockReset();
        useQuery.mockImplementation(() => ({loading: true, data: {}, error: null}));
        option = {
            lang: 'fr',
            pickerConfig: {
                selectableTypesTable: []
            },
            selectedPath: '/content',
            searchTerms: ''
        };
        const editorContext = {
            site: 'test'
        };
        useContentEditorContext.mockImplementation(() => editorContext);
    });

    it('should sort data according to the sort option', () => {
        option.fieldSorter = {
            fieldName: 'lastModified.value',
            sortType: 'DESC'
        };
        useDialogPickerContent(option);
        expect(useQuery).toHaveBeenCalled();
        expect(useQuery.mock.calls[0][1].variables.fieldSorter).toEqual(option.fieldSorter);
    });

    it('shouldn\'t sort by default', () => {
        useDialogPickerContent(option);
        expect(useQuery).toHaveBeenCalled();
        expect(useQuery.mock.calls[0][1].variables.fieldSorter).toBe(undefined);
    });

    it('should search using searchPaths if picker config provide searchPaths', () => {
        option.pickerConfig.searchPaths = site => ['/users', `/sites/${site}/users`];
        useDialogPickerContent(option);
        expect(useQuery).toHaveBeenCalled();
        expect(useQuery.mock.calls[0][1].variables.searchPaths).toStrictEqual(['/users', '/sites/test/users']);
    });

    it('should search using selectedPath if picker config doesnt provide searchPaths', () => {
        useDialogPickerContent(option);
        expect(useQuery).toHaveBeenCalled();
        console.log(useQuery.mock.calls[0][1].variables);
        expect(useQuery.mock.calls[0][1].variables.searchPaths).toStrictEqual([option.selectedPath]);
    });
});
