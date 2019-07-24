import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';

import {SectionPropTypes} from '../../../../FormDefinitions/FormData.proptypes';

let styles = theme => ({
    section: {
        borderBottom: `1px solid ${theme.palette.ui.omega}`,
        padding: theme.spacing.unit * 4
    }
});

const SectionCmp = ({section, classes}) => {
    return (
        <section className={classes.section}>
            <Typography color="alpha" variant="gamma">{section.displayName}</Typography>
        </section>
    );
};

SectionCmp.propTypes = {
    section: SectionPropTypes.isRequired,
    classes: PropTypes.object.isRequired
};

export const Section = withStyles(styles)(SectionCmp);
Section.displayName = 'Section';
