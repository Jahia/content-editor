import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Toggle, Typography} from '@jahia/design-system-kit';
import {compose} from '~/utils';
import {FieldSetPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FieldContainer} from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet/Field';
import {useTranslation} from 'react-i18next';
import {useFormikContext} from 'formik';

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
        flexDirection: 'column',
        margin: `0 ${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 4}px`
    },
    fieldsetControlContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: `0 ${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 4}px`
    }
});

const ListSizeLimitFieldSet = ({fieldset, classes}) => {
    const {values, handleChange} = useFormikContext();
    const {t} = useTranslation('content-editor');
    const isDynamicFieldSet = fieldset.dynamic;
    const activatedFieldSet = (values && values[fieldset.name]) || !isDynamicFieldSet;

    return (
        <article className={classes.fieldsetContainer}>
            <div className={classes.fieldsetTitleContainer}>
                <Typography component="label" htmlFor={t('content-editor:label.contentEditor.section.listSizeLimit.name')} className={classes.fieldSetTitle} color="alpha" variant="zeta">
                    {t('content-editor:label.contentEditor.section.listSizeLimit.name')}
                </Typography>
                <Typography color="beta" variant="zeta" htmlFor={t('content-editor:label.contentEditor.section.listSizeLimit.description')}>
                    {t('content-editor:label.contentEditor.section.listSizeLimit.description')}
                </Typography>
            </div>
            <div className={classes.fieldsetControlContainer}>
                {isDynamicFieldSet &&
                <Toggle data-sel-role-dynamic-fieldset={fieldset.name}
                        id={fieldset.name}
                        checked={activatedFieldSet}
                        readOnly={fieldset.readOnly}
                        onChange={handleChange}
                />}

                <Typography component="label" htmlFor={fieldset.name} className={classes.fieldSetTitle} color="alpha" variant="zeta">
                    {fieldset.displayName}
                </Typography>
            </div>

            {activatedFieldSet && fieldset.fields.map(field => {
                return <FieldContainer key={field.name} field={field}/>;
            })}
        </article>
    );
};

ListSizeLimitFieldSet.propTypes = {
    fieldset: FieldSetPropTypes.isRequired,
    classes: PropTypes.object.isRequired
};

export const FieldSet = compose(
    withStyles(styles)
)(ListSizeLimitFieldSet);

FieldSet.displayName = 'ListSizeLimitFieldSet';
