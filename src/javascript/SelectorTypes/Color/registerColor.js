import {Color} from './Color';

export const registerColor = ceRegistry => {
    ceRegistry.add('selectorType', 'Color', {dataType: ['String'], cmp: Color, supportMultiple: false});
};
