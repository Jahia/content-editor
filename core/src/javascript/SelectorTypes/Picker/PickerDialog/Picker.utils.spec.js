import {
    allSitesEntry,
    getDetailedPathArray,
    getPathWithoutFile,
    getSite,
    getSiteNodes
} from './Picker.utils';

jest.mock('@jahia/ui-extender', () => {
    return {
        registry: {
            get: (type, key) => {
                return {
                    cmp: {
                        picker: {key: key === 'image' ? 'MediaPicker' : 'ContentPicker'},
                        treeConfigs: [{
                            getRootPath: () => {
                                return '/sites/digitall/files';
                            },
                            selectableTypes: ['nt:folder'],
                            openableTypes: ['nt:folder'],
                            rootLabelKey: 'content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel',
                            type: 'files'
                        }]
                    }
                };
            }
        }
    };
});
describe('Picker utils', () => {
    describe('getSiteNodes', () => {
        const siteA = {
            displayName: 'A',
            name: 'Z'
        };

        const siteB = {
            displayName: 'B',
            name: 'W'
        };

        const data = siteNodes => {
            return {
                jcr: {
                    result: {
                        siteNodes: siteNodes
                    }
                }
            };
        };

        const allSitesLabel = 'allSites';

        it('should order sites by alphabetical order', () => {
            expect(getSiteNodes(data([siteB, siteA]), allSitesLabel)).toStrictEqual([allSitesEntry(allSitesLabel), siteA, siteB]);
        });

        it('should return empty array when data jcr doesn\'t exist', () => {
            expect(getSiteNodes({}, allSitesLabel)).toStrictEqual([]);
        });

        it('should add all sites entry when more than 2 sites', () => {
            expect(getSiteNodes(data([siteA, siteB]), allSitesLabel)).toStrictEqual([allSitesEntry(allSitesLabel), siteA, siteB]);
            expect(getSiteNodes(data([siteA]), allSitesLabel)).toStrictEqual([siteA]);
        });
    });

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
