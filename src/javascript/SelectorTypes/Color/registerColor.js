import {Color} from './Color';

export const registerColor = ceRegistry => {
    ceRegistry.add('selectorType', 'Color', {cmp: Color, supportMultiple: false});
};
