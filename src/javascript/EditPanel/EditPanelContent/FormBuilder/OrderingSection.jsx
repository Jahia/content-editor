import {useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {useTranslation} from 'react-i18next';
import {useFormikContext} from 'formik';
import {Constants} from '~/ContentEditor.constants';
import {ChildrenSection} from '~/EditPanel/EditPanelContent/FormBuilder/ChildrenSection';
import React from 'react';
import PropTypes from 'prop-types';

export const OrderingSection = ({mode}) => {
    const {nodeData} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const {t} = useTranslation('content-editor');

    const {values} = useFormikContext();
    const canAutomaticallyOrder = values && values[Constants.automaticOrdering.mixin] !== undefined;
    const canManuallyOrder = nodeData.primaryNodeType.hasOrderableChildNodes;

    const isOrderingSection = !nodeData.isSite &&
        !nodeData.isPage &&
        (canManuallyOrder || canAutomaticallyOrder) &&
        mode === Constants.routes.baseEditRoute;

    if (isOrderingSection) {
        const section = {
            isOrderingSection: true,
            displayName: t('content-editor:label.contentEditor.section.listAndOrdering.title'),
            fieldSets: sections.filter(section => section.name === 'listOrdering')
                .reduce((acc, value) => [...acc, ...value.fieldSets.filter(f => f.name !== 'jmix:orderedList')], [])
        };

        return (
            <ChildrenSection
                displayName={section.displayName}
                section={section}
                canAutomaticallyOrder={canAutomaticallyOrder}
                canManuallyOrder={canManuallyOrder}
            />
        );
    }

    return false;
};

OrderingSection.propTypes = {
    mode: PropTypes.string.isRequired
};
