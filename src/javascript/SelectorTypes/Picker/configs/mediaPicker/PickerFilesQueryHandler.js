import {FilesQueryHandler} from '@jahia/jcontent';

export const PickerFilesQueryHandler = {
    ...FilesQueryHandler,

    getQueryVariables: options => ({
        ...FilesQueryHandler.getQueryVariables(options),
        fieldFilter: {
            multi: options.selectableFilter ? 'ANY' : 'NONE',
            filters: (options.selectableFilter ? options.selectableFilter : [])
        }
    }),

    getFragments: () => [...FilesQueryHandler.getFragments()]
};
