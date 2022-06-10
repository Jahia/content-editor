import {Category} from './Category';

export const registerCategory = ceRegistry => {
    ceRegistry.add('selectorType', 'Category', {cmp: Category, supportMultiple: true});
};
