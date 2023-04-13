import {RichText} from './RichText';

export const registerRichText = ceRegistry => {
    ceRegistry.add('selectorType', 'RichText', {
        dataType: ['String'],
        cmp: RichText,
        labelKey: 'content-editor:label.contentEditor.selectorTypes.richText.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.richText.description'},
            {name: 'iconStart', value: 'RichText'}
        ],
        supportMultiple: false
    });
};
