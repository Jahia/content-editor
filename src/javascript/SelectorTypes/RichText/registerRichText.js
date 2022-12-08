import {RichText} from './RichText';

export const registerRichText = ceRegistry => {
    ceRegistry.add('selectorType', 'RichText', {dataType: ['String'], cmp: RichText, supportMultiple: false});
};
