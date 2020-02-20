import React from 'react';
import PropTypes from 'prop-types';
import {Section} from './Section';
import {Form} from 'formik';

import {useContentEditorContext} from '~/ContentEditor.context';
import {SectionsPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {ChildrenSection} from './ChildrenSection';
import {useTranslation} from 'react-i18next';

const FormBuilder = ({mode}) => {
    const context = useContentEditorContext();
    const {t} = useTranslation();

    return (
        <Form>
            <section data-sel-mode={mode}>
                {context.sections.map(section => {
                    return <Section key={section.displayName} section={section}/>;
                })}
                {!context.nodeData.isPage && context.nodeData.primaryNodeType.hasOrderableChildNodes &&
                    <ChildrenSection key={t('content-editor:label.contentEditor.section.listAndOrdering.title')} section={{displayName: t('content-editor:label.contentEditor.section.listAndOrdering.title')}}/>}
            </section>
        </Form>
    );
};

FormBuilder.contextTypes = {
    context: PropTypes.shape({
        sections: SectionsPropTypes.isRequired
    })
};

FormBuilder.propTypes = {
    mode: PropTypes.string.isRequired
};

export default FormBuilder;
