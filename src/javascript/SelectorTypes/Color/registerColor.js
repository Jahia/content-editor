import {Color} from './Color';

export const registerColor = ceRegistry => {
    ceRegistry.add('selectorType', 'Color', {
        dataType: ['String'],
        cmp: Color,
        labelKey: 'content-editor:label.contentEditor.selectorTypes.color.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.color.description'},
            {name: 'iconStart', value: 'Palette'}
        ],
        supportMultiple: false
    });
};
