import {hasToRenderAction} from '~/EditPanel/tabbar/TabBar.utils';

describe('TabBar Utils', () => {
    it('should hasToRender returns true when check edit action in create', () => {
        const hasToRender = hasToRenderAction('edit', 'create');
        expect(hasToRender).toBe(true);
    });

    it('should hasToRender returns true when check edit action in edit', () => {
        const hasToRender = hasToRenderAction('edit', 'edit');
        expect(hasToRender).toBe(true);
    });

    it('should hasToRender returns true when check advanced action in create', () => {
        const hasToRender = hasToRenderAction('advanced', 'create');
        expect(hasToRender).toBe(false);
    });

    it('should hasToRender returns true when check advancde action in edit', () => {
        const hasToRender = hasToRenderAction('advanced', 'edit');
        expect(hasToRender).toBe(true);
    });
});
