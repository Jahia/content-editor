import {Tag} from './Tag';

export const registerTag = ceRegistry => {
    ceRegistry.add('selectorType', 'Tag', {cmp: Tag, supportMultiple: true});
};
