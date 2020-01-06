import {getPathWithoutFile, getSite, getDetailedPathArray} from './PickerDialog.utils';

describe('PickerDialog Utils', () => {
    describe('getPathWithoutFile', () => {
        it('should return undefined when initialSelectedItem is empty', () => {
            expect(getPathWithoutFile()).toBe(undefined);
        });

        it('should return /toto/tata when give a cat.js file', () => {
            expect(getPathWithoutFile('/toto/tata/cat.js')).toBe('/toto/tata');
        });
    });

    describe('getSite', () => {
        it('should return undefined if path is not defined', () => {
            expect(getSite()).toBe(undefined);
        });

        it('should return /site/digitall when give a full path', () => {
            expect(getSite('/site/digitall/files/cats/cats.js')).toBe('/site/digitall');
        });
    });

    describe('getDetailedPathArray', () => {
        it('should return [] if path is not defined', () => {
            expect(getDetailedPathArray()).toEqual([]);
        });

        it('should return detailed path if path is not defined', () => {
            expect(getDetailedPathArray('/site/digitall/files/cats/cats.js', '/site/digitall')).toEqual([
                '/site/digitall',
                '/site/digitall/files'
            ]);
        });
    });
});
