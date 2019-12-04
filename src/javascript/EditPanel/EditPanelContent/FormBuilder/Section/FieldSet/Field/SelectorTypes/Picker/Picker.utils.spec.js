import {allSitesEntry, getSiteNodes} from './Picker.utils';

describe('getSiteNodes test', () => {
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

    it('should add all sites entry when more than 2 sites', () => {
        expect(getSiteNodes(data([siteA, siteB]), allSitesLabel)).toStrictEqual([allSitesEntry(allSitesLabel), siteA, siteB]);
        expect(getSiteNodes(data([siteA]), allSitesLabel)).toStrictEqual([siteA]);
    });
});
