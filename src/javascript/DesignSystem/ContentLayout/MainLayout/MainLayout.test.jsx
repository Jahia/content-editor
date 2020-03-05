import React from 'react';
import {shallow} from '@jahia/test-framework';
import MainLayout from './MainLayout';

describe('Main layout', () => {
    it('Should render with content only', async () => {
        const mainLayout = shallow(<MainLayout><div>content</div></MainLayout>);
        expect(mainLayout.contains(<div>header</div>)).toBeFalsy();
        expect(mainLayout.contains(<div>content</div>)).toBeTruthy();
    });

    it('Should render with header and content', async () => {
        const mainLayout = shallow(<MainLayout header={<div>header</div>}><div>content</div></MainLayout>);
        expect(mainLayout.contains(<div>header</div>)).toBeTruthy();
        expect(mainLayout.contains(<div>content</div>)).toBeTruthy();
    });
});
