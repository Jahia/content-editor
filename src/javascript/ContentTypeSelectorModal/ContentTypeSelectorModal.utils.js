import React from 'react';
import {AddCircle, toIconComponent} from '@jahia/moonstone';

let getIconStart = function (node) {
    return (node.iconURL && !node.iconURL.endsWith('/nt_base.png') && toIconComponent(node.iconURL)) || <AddCircle/>;
};

export const filterTree = (tree, selectedType, filter) => tree
    .map(category => {
        const filteredNodes = filter ? category.children.filter(node => {
            return node.name.toLowerCase().includes(filter) || node.label.toLowerCase().includes(filter);
        }) : category.children;

        return {
            ...category,
            iconStart: getIconStart(category),
            children: filteredNodes.map(node => {
                return {
                    ...node,
                    iconStart: getIconStart(node)
                };
            })
        };
    })
    .filter(category => {
        if (!isOpenableEntry(category)) {
            return filter ? category.name.toLowerCase().includes(filter) || category.label.toLowerCase().includes(filter) : true;
        }

        return category.children.length !== 0;
    });

export const isOpenableEntry = entry => {
    return (entry.nodeType && entry.nodeType.mixin) || entry.name === 'nt:base';
};
