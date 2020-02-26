import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {DropableSpace} from './DropableSpace';

jest.mock('react-dnd', () => {
    return {
        useDrop: jest.fn()
    };
});

import {useDrop} from 'react-dnd';

describe('DropableSpace component', () => {
    it('should call onReorder when drop', () => {
        const item = {name: 'tata'};
        useDrop.mockImplementation(obj => {
            obj.drop(item);
            return [{}];
        });

        const handleReorder = jest.fn();

        shallowWithTheme(
            <DropableSpace index={42} childUp={null} childDown={null} onReorder={handleReorder}/>,
            {},
            dsGenericTheme
        );

        expect(handleReorder).toHaveBeenCalledWith(item.name, 42);
    });
});
