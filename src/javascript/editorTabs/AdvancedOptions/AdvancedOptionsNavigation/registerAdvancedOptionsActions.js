import {goToOptionAction} from './goToOptionAction';

export const registerAdvancedOptionsActions = (actionsRegistry, t) => {
    actionsRegistry.addOrReplace('action', 'goToTechnicalInformation', goToOptionAction, {
        buttonLabel: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.label'),
        targets: ['AdvancedOptionsActions:1'],
        value: 'technicalInformation',
        shouldBeDisplayed: () => true
    });
};
