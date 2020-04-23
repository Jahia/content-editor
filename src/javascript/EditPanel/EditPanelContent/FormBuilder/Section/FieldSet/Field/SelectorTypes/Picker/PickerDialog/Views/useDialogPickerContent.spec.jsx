import {useDialogPickerContent} from './useDialogPickerContent';

jest.mock('@apollo/react-hooks', () => {
    return {
        useQuery: jest.fn()
    };
});

import {useQuery} from '@apollo/react-hooks';

describe('useDialogPickerContent', () => {
    let option;
    beforeEach(() => {
        useQuery.mockReset();
        useQuery.mockImplementation(() => ({loading: true, data: {}, error: null}));
        option = {
            lang: 'fr',
            pickerConfig: {

            },
            selectedPath: '/content',
            searchTerms: ''
        };
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
});
