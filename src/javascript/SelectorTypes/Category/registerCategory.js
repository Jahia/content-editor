import {Category} from './Category';

export const registerCategory = ceRegistry => {
    ceRegistry.add('selectorType', 'Category', {dataType: ['String'], cmp: Category, supportMultiple: true});
};
