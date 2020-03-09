import goToOption from './AdvancedOptionsNavigation/GoToOption.action';

export const registerAdvancedOptionsActions = (actionsRegistry, t) => {
    actionsRegistry.addOrReplace('action', 'goToTechnicalInformation', goToOption, {
        buttonLabel: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation'),
        targets: ['AdvancedOptionsActions:1'],
        value: 'technicalInformation'
    });
};
