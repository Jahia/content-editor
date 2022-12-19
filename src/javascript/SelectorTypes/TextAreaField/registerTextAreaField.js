import {TextAreaField} from './TextAreaField';

export const registerTextArea = ceRegistry => {
    ceRegistry.add('selectorType', 'TextArea', {
        dataType: ['String'],
        cmp: TextAreaField,
        labelKey: 'content-editor:label.contentEditor.selectorTypes.textArea.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.textArea.description'},
            {name: 'iconStart', value: 'Textarea'}
        ],
        supportMultiple: false
    });
};
