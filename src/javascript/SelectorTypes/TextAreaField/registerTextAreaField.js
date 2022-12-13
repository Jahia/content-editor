import {TextAreaField} from './TextAreaField';

export const registerTextArea = ceRegistry => {
    ceRegistry.add('selectorType', 'TextArea', {dataType: ['String'], cmp: TextAreaField, supportMultiple: false});
};
