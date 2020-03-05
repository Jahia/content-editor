import React from 'react';
import {shallow} from '@jahia/test-framework';
import ContentHeader from './ContentHeader';

describe('Content header', () => {
    it('Should render with everything', async () => {
        const contentHeader = shallow(<ContentHeader
            title={<div>title</div>}
            mainAction={<div>mainAction</div>}
            breadcrumb={<div>breadcrumb</div>}
            toolbar={<div>toolbar</div>}/>);
        expect(contentHeader.contains(<div>title</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>mainAction</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>breadcrumb</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>toolbar</div>)).toBeTruthy();
        expect(contentHeader.find('Separator')).toHaveLength(1);
    });

    it('Should render with title and mainAction only', async () => {
        const contentHeader = shallow(<ContentHeader
            title={<div>title</div>}
            mainAction={<div>mainAction</div>}/>);
        expect(contentHeader.contains(<div>title</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>mainAction</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>breadcrumb</div>)).toBeFalsy();
        expect(contentHeader.contains(<div>toolbar</div>)).toBeFalsy();
        expect(contentHeader.find('Separator')).toHaveLength(0);
    });

    it('Should render without breadcrumb', async () => {
        const contentHeader = shallow(<ContentHeader
            title={<div>title</div>}
            mainAction={<div>mainAction</div>}
            toolbar={<div>toolbar</div>}/>);
        expect(contentHeader.contains(<div>title</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>mainAction</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>breadcrumb</div>)).toBeFalsy();
        expect(contentHeader.contains(<div>toolbar</div>)).toBeTruthy();
        expect(contentHeader.find('Separator')).toHaveLength(1);
    });

    it('Should render without toolbar', async () => {
        const contentHeader = shallow(<ContentHeader
            title={<div>title</div>}
            mainAction={<div>mainAction</div>}
            breadcrumb={<div>breadcrumb</div>}/>);
        expect(contentHeader.contains(<div>title</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>mainAction</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>breadcrumb</div>)).toBeTruthy();
        expect(contentHeader.contains(<div>toolbar</div>)).toBeFalsy();
        expect(contentHeader.find('Separator')).toHaveLength(0);
    });
});
