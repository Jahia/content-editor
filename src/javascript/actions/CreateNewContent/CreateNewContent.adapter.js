import {useQuery} from 'react-apollo-hooks';
import {getTreeOfContent} from './CreateNewContent.gql-queries';

export const useTreeOfNewContent = (variables, client) => {
    const result = useQuery(getTreeOfContent, {
        variables,
        client
    });

    if (result.data && result.data.jcr) {
        result.tree = result.data.jcr.nodeTypeByName.subTypes.nodes
            .filter(node => !node.mixin)
            .map(node => {
                return {
                    ...node,
                    id: node.name,
                    label: node.displayName,
                    iconURL: `${node.icon}.png`,
                    parent: node.supertypes
                        .filter(superType =>
                            superType.mixin && superType.isNodeType && superType.name !== 'jmix:droppableContent'
                        )[0]
                };
            })
            .reduce((tree, node) => {
                if (node.parent) {
                    const parentCategoryIndex = tree.findIndex(el => el.id === node.parent.name);
                    if (parentCategoryIndex > -1) {
                        tree[parentCategoryIndex].childs.push(node);
                    } else {
                        tree.push({
                            ...node.parent,
                            id: node.parent.name,
                            label: node.parent.displayName,
                            iconURL: `${node.parent.icon}.png`,
                            childs: [node]
                        });
                    }
                } else {
                    tree[0].childs.push(node);
                }

                return tree;
            }, [{
                ...result.data.jcr.base,
                id: result.data.jcr.base.name,
                label: result.data.jcr.base.displayName,
                iconURL: `${result.data.jcr.base.icon}.png`,
                childs: []
            }])
            .filter(category => category.childs.length > 0);
    }

    return result;
};
