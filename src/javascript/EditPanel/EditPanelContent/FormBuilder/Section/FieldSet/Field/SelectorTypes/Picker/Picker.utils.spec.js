import {allSitesEntry, getSiteNodes, extractConfigs, getSite, getDetailedPathArray, getPathWithoutFile} from './Picker.utils';

describe('Picker utils', () => {
    describe('getSiteNodes', () => {
        const withPermission = {
            hasPermission: true,
            displayName: 'withPermission',
            name: 'withPermission'
        };

        const withoutPermission = {
            hasPermission: false,
            displayName: 'withoutPermission',
            name: 'withoutPermission'
        };

        const siteA = {
            hasPermission: true,
            displayName: 'A',
            name: 'Z'
        };

        const siteB = {
            hasPermission: true,
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

        it('should return only sites with permission', () => {
            const result = getSiteNodes(data([withoutPermission, withPermission]), allSitesLabel);
            expect(result).toStrictEqual([withPermission]);
        });

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

    describe('extractConfigs', () => {
        let t;
        beforeEach(() => {
            t = jest.fn();
        });

        it('should return the content picker config', () => {
            const {pickerConfig} = extractConfigs({selectorOptions: [{name: 'type', value: 'folder'}]}, {}, t);
            expect(pickerConfig.picker.key).toBe('ContentPicker');
        });

        it('should return the image picker config', () => {
            const {pickerConfig} = extractConfigs({selectorOptions: [{name: 'type', value: 'image'}]}, {}, t);
            expect(pickerConfig.picker.key).toBe('MediaPicker');
        });

        it('should return the nodeTreeConfigs adapted', () => {
            const field = {
                selectorOptions: [{
                    name: 'type',
                    value: 'image'
                }]
            };
            const {nodeTreeConfigs} = extractConfigs(field, {site: 'digitall'}, t);

            expect(nodeTreeConfigs).toMatchObject([{
                key: 'browse-tree-files',
                openableTypes: ['nt:folder'],
                rootPath: '/sites/digitall/files',
                selectableTypes: ['nt:folder'],
                treeConfig: {
                    openableTypes: ['nt:folder'],
                    rootLabelKey: 'content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel',
                    selectableTypes: ['nt:folder'],
                    type: 'files'
                },
                type: 'files'
            }]);
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
