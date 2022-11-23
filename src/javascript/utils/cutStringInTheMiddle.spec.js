import {cutStringInTheMiddle} from './index';

describe('cutStringInTheMiddle', () => {
    it('should truncate string length great then threshold', () => {
        expect(cutStringInTheMiddle('/sites/digitall/home/our-companies/area-main/companies/all-organic-foods/companySpecificContent/delicious-foods/carousel-image', 20, 20, '...')).toBe('/sites/digitall/home...foods/carousel-image');
    });

    it('should not truncate string length smaller than or equals to threshold', () => {
        expect(cutStringInTheMiddle('Florent', 10, 10, '...')).toBe('Florent');
    });
});
