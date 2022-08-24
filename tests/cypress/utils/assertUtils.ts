export const assertUtils = {
    isAriaExpanded(elem) {
        return elem.should('have.attr', 'aria-expanded').and('equal', 'true');
    },

    isAriaCollapsed(elem) {
        return elem.should('have.attr', 'aria-expanded').and('equal', 'false');
    },

    isVisible(elem) {
        return elem.should('be.visible');
    }
};
