import {registry} from '@jahia/ui-extender';
import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {getBaseSearchContextData} from '~/SelectorTypes/Picker/Picker.utils';

export const getPagesSearchContextData = p => {
    const pagesItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.PAGES);
    const res = getBaseSearchContextData(p);
    const {node, t} = p;
    if (node) {
        const pages = node.ancestors.filter(n => n.primaryNodeType.name === 'jnt:page');
        if (pages.length > 0) {
            const page = pages[0];
            res.splice(2, 0, {
                label: t(pagesItem.label),
                searchPath: page.path,
                iconStart: pagesItem.icon
            });
        } else if (node.primaryNodeType.name === 'jnt:page') {
            res.splice(2, 1, {
                label: t(pagesItem.label),
                searchPath: node.path,
                iconStart: pagesItem.icon
            });
        }
    }

    return res;
};
