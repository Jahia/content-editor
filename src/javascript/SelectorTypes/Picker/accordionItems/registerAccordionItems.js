import {registerDefaultAccordionItems} from './default';
import {registerEditorialAccordionItems} from './editorial';
import {registerEditoriallinkAccordionItems} from './editoriallink';
import {registerImageAccordionItems} from './image';
import {registerFileAccordionItems} from './file';
import {registerPageAccordionItems} from './page';
import {registerFolderAccordionItems} from './folder';
import {registerContentFolderAccordionItems} from './contentfolder';
import {registerCategoriesAccordionItems} from './categories';

export const registerAccordionItems = registry => {
    registerDefaultAccordionItems(registry);
    registerEditorialAccordionItems(registry);
    registerEditoriallinkAccordionItems(registry);
    registerImageAccordionItems(registry);
    registerFileAccordionItems(registry);
    registerPageAccordionItems(registry);
    registerFolderAccordionItems(registry);
    registerContentFolderAccordionItems(registry);
    registerCategoriesAccordionItems(registry);
};
