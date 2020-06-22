import {adaptSelection} from './Tag.utils';

describe('Tag utils', () => {
    describe('adaptSelection', () => {
        let selection = ['movie', 'healthy', 'sport', 'politic', 'mathematics'];
        let separator = ',';

        it('should return correct values', () => {
            const adaptedSelection = adaptSelection(selection, separator);
            expect(adaptedSelection).toEqual(selection);
        });

        it('should adapt selection', () => {
            selection = ['engineer , software , data', 'cloud'];

            const adaptedSelection = adaptSelection(selection, separator);
            expect(adaptedSelection).toEqual(['engineer', 'software', 'data', 'cloud']);
        });

        it('should adapt selection depends on the separator', () => {
            separator = '#';
            selection = ['dev , back , scalable # tdd , ddd , scrum', 'solution'];

            const adaptedSelection = adaptSelection(selection, separator);
            expect(adaptedSelection).toEqual(['dev , back , scalable', 'tdd , ddd , scrum', 'solution']);
        });
    });
});
