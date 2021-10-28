import goToOption from './AdvancedOptionsNavigation/GoToOption.action';

export const registerAdvancedOptionsActions = (actionsRegistry, t) => {
    actionsRegistry.addOrReplace('action', 'goToTechnicalInformation', goToOption, {
        buttonLabel: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.label'),
        targets: ['AdvancedOptionsActions:1'],
        value: 'technicalInformation',
        shouldBeDisplayed: () => true
    });
};
