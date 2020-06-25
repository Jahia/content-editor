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

const FormBuilder = ({mode}) => {
    const {nodeData} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const {t} = useTranslation();

    const isOrderingSection = !nodeData.isPage && nodeData.primaryNodeType.hasOrderableChildNodes;
    const cloneSections = isOrderingSection ? [...sections] : sections;
    if (isOrderingSection && mode === Constants.routes.baseEditRoute) {
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
                        <ChildrenSection key={section.displayName} section={section}/> :
                        <Section key={section.displayName} section={section}/>
                ))}
            </section>
        </Form>
    );
};

FormBuilder.contextTypes = {
    context: PropTypes.shape({
        sections: SectionsPropTypes.isRequired,
        nodeData: PropTypes.object.isRequired
    })
};

FormBuilder.propTypes = {
    mode: PropTypes.string.isRequired
};

export default FormBuilder;
