import {Tag} from './Tag';

export const registerTag = ceRegistry => {
    ceRegistry.add('selectorType', 'Tag', {
        dataType: ['String'],
        displayValueKey: 'content-editor:label.contentEditor.selectorTypes.tag.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.tag.description'},
            {name: 'iconStart', value: 'Label'}
        ],
        cmp: Tag, supportMultiple: true
    });
};
