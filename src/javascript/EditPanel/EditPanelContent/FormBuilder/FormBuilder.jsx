import React from 'react';
import PropTypes from 'prop-types';
import {Section} from './Section';
import {connect, Form} from 'formik';

import {useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {SectionsPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {ChildrenSection} from './ChildrenSection';
import {useTranslation} from 'react-i18next';
import {Constants} from '~/ContentEditor.constants';
import {compose} from '~/utils';

const FormBuilderCmp = ({mode, formik: {values}}) => {
    const {nodeData} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const {t} = useTranslation('content-editor');

    if (!nodeData || !sections || sections.length === 0) {
        return <></>;
    }

    const canAutomaticallyOrder = values && values[Constants.automaticOrdering.mixin] !== undefined;
    const canManuallyOrder = nodeData.primaryNodeType.hasOrderableChildNodes;

    const isOrderingSection = !nodeData.isSite &&
        !nodeData.isPage &&
        (canManuallyOrder || canAutomaticallyOrder) &&
        mode === Constants.routes.baseEditRoute;

    const cloneSections = isOrderingSection ? [...sections] : sections;
    if (isOrderingSection) {
        const orderingSection = {
            isOrderingSection: true,
            displayName: t('content-editor:label.contentEditor.section.listAndOrdering.title')
        };
        cloneSections.splice(1, 0, orderingSection);
    }

    return (
        <Form>
            <section data-sel-mode={mode}>
                {cloneSections.filter(section => !section.hide).map(section => (
                    section.isOrderingSection ?
                        <ChildrenSection
                            key={section.displayName}
                            section={section}
                            canAutomaticallyOrder={canAutomaticallyOrder}
                            canManuallyOrder={canManuallyOrder}
                        /> :
                        <Section key={section.displayName} section={section}/>
                ))}
            </section>
        </Form>
    );
};

FormBuilderCmp.contextTypes = {
    context: PropTypes.shape({
        sections: SectionsPropTypes.isRequired,
        nodeData: PropTypes.object.isRequired
    })
};

FormBuilderCmp.propTypes = {
    mode: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired
};

const FormBuilder = compose(
    connect
)(FormBuilderCmp);

export default FormBuilder;
