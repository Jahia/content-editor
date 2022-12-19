import {Category} from './Category';

export const registerCategory = ceRegistry => {
    ceRegistry.add('selectorType', 'Category', {
        dataType: ['String'],
        labelKey: 'content-editor:label.contentEditor.selectorTypes.category.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.category.description'},
            {name: 'iconStart', value: 'ViewTree'}
        ],
        cmp: Category, supportMultiple: true
    });
};
