import {TextAreaField} from './TextAreaField';

export const registerTextArea = ceRegistry => {
    ceRegistry.add('selectorType', 'TextArea', {cmp: TextAreaField, supportMultiple: false});
};
