import {toIconComponent} from '@jahia/moonstone';

export const filterTree = (tree, selectedType, filter) => tree
    .map(category => {
        const filteredNodes = filter ? category.children.filter(node => {
            return node.name.toLowerCase().includes(filter) || node.label.toLowerCase().includes(filter);
        }) : category.children;

        return {
            ...category,
            iconStart: toIconComponent(category.iconURL),
            children: filteredNodes.map(node => {
                return {
                    ...node,
                    iconStart: toIconComponent(node.iconURL)
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
