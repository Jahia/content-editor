import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Section} from './Section';

import {useContentEditorContext} from '../../../../ContentEditor.context';
import {SectionsPropTypes} from '../../../FormDefinitions/FormData.proptypes';

let styles = theme => ({
    container: {
        backgroundColor: theme.palette.ui.epsilon
    }
});

const FormBuilderCmp = ({classes}) => {
    const context = useContentEditorContext();

    return (
        <section className={classes.container}>
            {context.sections.map(section => {
                return <Section key={section.displayName} section={section}/>;
            })}
        </section>
    );
};

FormBuilderCmp.contextTypes = {
    context: PropTypes.shape({
        sections: SectionsPropTypes.isRequired
    })
};

FormBuilderCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

const FormBuilder = withStyles(styles)(FormBuilderCmp);
FormBuilder.displayName = 'FormBuilder';

export default FormBuilder;
