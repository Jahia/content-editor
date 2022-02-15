import React from 'react';
import PropTypes from 'prop-types';
import {Section} from './Section';
import {Form} from 'formik';

import {useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {SectionsPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {ChildrenSection} from './ChildrenSection';
import {useTranslation} from 'react-i18next';
import {Constants} from '~/ContentEditor.constants';

const FormBuilderCmp = ({mode}) => {
    // Const {values} = useFormikContext();
    const {nodeData} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const {t} = useTranslation('content-editor');

    if (!nodeData || !sections || sections.length === 0) {
        return <></>;
    }

    const canAutomaticallyOrder = false; /// values && values[Constants.automaticOrdering.mixin] !== undefined;
    const canManuallyOrder = nodeData.primaryNodeType.hasOrderableChildNodes;

    const isOrderingSection = !nodeData.isSite &&
        !nodeData.isPage &&
        (canManuallyOrder || canAutomaticallyOrder) &&
        mode === Constants.routes.baseEditRoute;

    const cloneSections = isOrderingSection ? [...sections] : sections;
    if (isOrderingSection) {
        const orderingSection = {
            isOrderingSection: true,
            displayName: t('content-editor:label.contentEditor.section.listAndOrdering.title'),
            fieldSets: sections.filter(section => section.name === 'listOrdering')
                .reduce((acc, value) => [...acc, ...value.fieldSets.filter(f => f.name !== 'jmix:orderedList')], [])
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
    mode: PropTypes.string.isRequired
};

const FormBuilder = FormBuilderCmp;

export default FormBuilder;
