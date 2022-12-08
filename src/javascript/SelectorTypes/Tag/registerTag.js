import {Tag} from './Tag';

export const registerTag = ceRegistry => {
    ceRegistry.add('selectorType', 'Tag', {dataType: ['String'], cmp: Tag, supportMultiple: true});
};
