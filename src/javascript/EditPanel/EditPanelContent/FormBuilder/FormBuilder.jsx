import React from 'react';
import PropTypes from 'prop-types';
import {Section} from './Section';
import {Form} from 'formik';

import {useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {SectionsPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {OrderingSection} from './OrderingSection';

const FormBuilderCmp = ({mode}) => {
    const {nodeData} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();

    if (!nodeData || !sections || sections.length === 0) {
        return <></>;
    }

    const children = sections.filter(section => !section.hide).map(section => (
        <Section key={section.displayName} section={section}/>
    ));
    children.splice(1, 0, <OrderingSection key="ordering" mode={mode}/>);

    return (
        <Form>
            <section data-sel-mode={mode}>
                {children}
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
