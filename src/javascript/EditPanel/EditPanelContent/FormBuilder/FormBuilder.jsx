import React from 'react';
import PropTypes from 'prop-types';
import {Section} from './Section';
import {Form} from 'formik';

import {useContentEditorContext} from '~/ContentEditor.context';
import {SectionsPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';

const FormBuilder = ({mode}) => {
    const context = useContentEditorContext();

    return (
        <Form>
            <section data-sel-mode={mode}>
                {context.sections.map(section => {
                    return <Section key={section.displayName} section={section}/>;
                })}
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
