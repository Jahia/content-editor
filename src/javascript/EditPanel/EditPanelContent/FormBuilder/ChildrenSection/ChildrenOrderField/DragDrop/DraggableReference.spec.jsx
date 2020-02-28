import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {DraggableReference} from './DraggableReference';

jest.mock('react-dnd', () => {
    return {
        useDrag: jest.fn()
    };
});

import {useDrag} from 'react-dnd';

describe('DraggableReference component', () => {
    const child = {
        name: 'subNode1',
        primaryNodeType: {
            displayName: 'subNode1',
            icon: '/icon'
        }
    };

    it('should display the reference when not dragging', () => {
        useDrag.mockImplementation(() => ([{isDragging: false}]));

        const cmp = shallowWithTheme(
            <DraggableReference child={child}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('ReferenceCard');
    });

    it('should not display the reference when dragging', () => {
        useDrag.mockImplementation(() => ([{isDragging: true}]));

        const cmp = shallowWithTheme(
            <DraggableReference child={child}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).not.toContain('ReferenceCard');
    });
});
