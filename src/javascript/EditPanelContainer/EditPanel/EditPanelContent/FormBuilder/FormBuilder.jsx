import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Section} from './Section';
import {Form} from 'formik';

import {useContentEditorContext} from '../../../../ContentEditor.context';
import {SectionsPropTypes} from '../../../FormDefinitions/FormData.proptypes';

let styles = theme => ({
    container: {
        backgroundColor: theme.palette.ui.epsilon
    }
});

const FormBuilderCmp = ({classes, mode}) => {
    const context = useContentEditorContext();

    return (
        <Form>
            <section className={classes.container} data-sel-mode={mode}>
                {context.sections.map(section => {
                    return <Section key={section.displayName} section={section}/>;
                })}
            </section>
        </Form>
    );
};

FormBuilderCmp.contextTypes = {
    context: PropTypes.shape({
        sections: SectionsPropTypes.isRequired
    })
};

FormBuilderCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired
};

const FormBuilder = withStyles(styles)(FormBuilderCmp);
FormBuilder.displayName = 'FormBuilder';

export default FormBuilder;
