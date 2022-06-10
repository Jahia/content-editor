import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {FieldSetsDisplay} from './FieldSetsDisplay';

describe('FieldSetsDisplay component', () => {
    it('should be empty', () => {
        const cmp = shallowWithTheme(<FieldSetsDisplay fieldSets={[]}/>, {}, dsGenericTheme);
        expect(cmp.debug()).toBe('');
    });

    it('should render field set', () => {
        const cmp = shallowWithTheme(<FieldSetsDisplay fieldSets={[{name: 'myset', displayName: 'myname'}]}/>, {}, dsGenericTheme);
        expect(cmp.find('FieldSet').exists()).toBeTruthy();
    });

    it('should render field set with node check', () => {
        const mapFunction = fs => {
            fs.nodeCheck = {};
            fs.visibilityFunction = () => true;
            return fs;
        };

        const cmp = shallowWithTheme(<FieldSetsDisplay fieldSets={[{name: 'myset', displayName: 'myname'}]} fieldSetMapFcn={mapFunction}/>, {}, dsGenericTheme);
        expect(cmp.find('FieldSetWithNodeChecks').exists()).toBeTruthy();
    });
});
