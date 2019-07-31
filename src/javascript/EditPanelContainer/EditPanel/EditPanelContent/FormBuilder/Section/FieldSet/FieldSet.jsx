import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';
import {Toggle} from '../../../../../../DesignSystem/Toggle';

import {FieldSetPropTypes} from '../../../../../FormDefinitions/FormData.proptypes';

import {FieldContainer} from './Field';

let styles = theme => ({
    fieldsetContainer: {},
    fieldSetTitle: {
        width: 'auto',
        textTransform: 'uppercase',
        padding: `${theme.spacing.unit * 2}px 0`
    },
    fieldsetTitleContainer: {
        borderTop: `1px solid ${theme.palette.ui.omega}`,
        display: 'flex',
        flexDirection: 'row',
        margin: `0 ${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 4}px`
    }
});

const FieldSetCmp = ({fieldset, classes}) => {
    const [activated, setActivated] = useState(fieldset.activated);

    return (
        <article className={classes.fieldsetContainer}>
            <div className={classes.fieldsetTitleContainer}>
                {fieldset.dynamic &&
                <Toggle id={fieldset.name}
                        checked={activated}
                        onChange={(event, checked) => {
                            setActivated(checked);
                        }}
                />}

                <Typography component="h3" className={classes.fieldSetTitle} color="alpha" variant="zeta">
                    {fieldset.displayName}
                </Typography>
            </div>

            {activated && fieldset.fields.map(field => {
                return <FieldContainer key={field.name} field={field}/>;
            })}
        </article>
    );
};

FieldSetCmp.propTypes = {
    fieldset: FieldSetPropTypes.isRequired,
    classes: PropTypes.object.isRequired
};

export const FieldSet = withStyles(styles)(FieldSetCmp);
FieldSet.displayName = 'FieldSet';
