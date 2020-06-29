import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {Typography, Toggle, Badge} from '@jahia/design-system-kit';
import {ChildrenSectionPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {ManualOrdering} from './ManualOrdering';
import {useTranslation} from 'react-i18next';
import {AutomaticOrdering} from './AutomaticOrdering';
import {Constants} from '~/ContentEditor.constants';
import {compose} from '~/utils';
import {connect} from 'formik';
import {Public} from '@material-ui/icons';

const styles = theme => ({
    section: {
        borderBottom: `1px solid ${theme.palette.ui.omega}`,
        paddingBottom: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
        backgroundColor: theme.palette.ui.epsilon
    },
    sectionTitle: {
        textTransform: 'uppercase',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`
    },
    fieldSetTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: `0 ${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 4}px`,
        padding: `${theme.spacing.unit * 2}px 0`,
        borderTop: '1px solid #e0e6ea' /* TODO use moonstone color */
    },
    fieldSetTitle: {
        width: 'auto',
        textTransform: 'uppercase'
    },
    automaticSwitchContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    automaticSwitch: {
        width: 'auto',
        padding: `${theme.spacing.unit * 2}px 0`,
        textTransform: 'uppercase'
    },
    formControl: {
        margin: '0 48px 0 32px'
    }
});

export const ChildrenSectionCmp = ({section, classes, formik: {values, handleChange}}) => {
    const {t} = useTranslation();
    const canAutomaticOrder = values && values[Constants.automaticOrdering.mixin] !== undefined;
    const isAutomaticOrder = canAutomaticOrder && values[Constants.automaticOrdering.mixin];

    return (
        <section className={classes.section} data-sel-content-editor-fields-group={section.displayName}>
            <Typography component="h2" className={classes.sectionTitle} color="alpha" variant="gamma">{section.displayName}</Typography>

            <article>
                <div className={classes.fieldSetTitleContainer}>
                    <Typography component="label" htmlFor={t('content-editor:label.contentEditor.section.listAndOrdering.ordering')} className={classes.fieldSetTitle} color="alpha" variant="zeta">
                        {t('content-editor:label.contentEditor.section.listAndOrdering.ordering')}
                    </Typography>
                    <Badge
                           badgeContent={t('content-editor:label.contentEditor.edit.sharedLanguages')}
                           icon={<Public/>}
                           variant="normal"
                           color="info"
                    />
                </div>

                <div className={classes.formControl}>
                    {canAutomaticOrder &&
                    <>
                        <Typography color="beta" variant="zeta" htmlFor={t('content-editor:label.contentEditor.section.listAndOrdering.description')}>
                            {t('content-editor:label.contentEditor.section.listAndOrdering.description')}
                        </Typography>

                        <div className={classes.automaticSwitchContainer}>
                            <Toggle data-sel-role-automatic-ordering={Constants.automaticOrdering.mixin}
                                    id={Constants.automaticOrdering.mixin}
                                    checked={isAutomaticOrder}
                                    onChange={handleChange}
                            />
                            <Typography component="label" htmlFor={Constants.automaticOrdering.mixin} className={classes.automaticSwitch} color="alpha" variant="zeta">
                                {t('content-editor:label.contentEditor.section.listAndOrdering.automatic')}
                            </Typography>
                        </div>

                        {!isAutomaticOrder && <ManualOrdering/>}
                        {isAutomaticOrder && <AutomaticOrdering/>}
                    </>}

                    {!canAutomaticOrder && <ManualOrdering/>}
                </div>
            </article>
        </section>
    );
};

ChildrenSectionCmp.propTypes = {
    section: ChildrenSectionPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

export const ChildrenSection = compose(
    connect,
    withStyles(styles)
)(ChildrenSectionCmp);
ChildrenSection.displayName = 'ChildrenSection';
