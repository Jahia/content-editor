
import copyLanguageAction from './copyLanguage.action';

describe('copy language action', () => {
    describe('init', () => {
        const props = {};
        let context;
        beforeEach(() => {
            context = {
                mode: 'edit',
                siteInfo: {
                    languages: [{
                        displayName: 'Deutsch',
                        language: 'de',
                        activeInEdit: true
                    },
                    {
                        displayName: 'Français',
                        language: 'fr',
                        activeInEdit: true
                    }]
                }
            };
        });

        it('action should be displayed', () => {
            copyLanguageAction.init(context, props);

            expect(context.enabled).toBe(true);
        });

        it('action should not be displayed', () => {
            context.siteInfo.languages.splice(0, 1);
            copyLanguageAction.init(context, props);

            expect(context.enabled).toBe(false);
        });
    });
});
