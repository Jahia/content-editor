import {RichText} from './RichText';

export const registerRichText = ceRegistry => {
    ceRegistry.add('selectorType', 'RichText', {cmp: RichText, supportMultiple: false});
};
