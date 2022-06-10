import React from 'react';
import PropTypes from 'prop-types';
import {Typography} from '@jahia/design-system-kit';
import {withStyles} from '@material-ui/core';
import {useTranslation} from 'react-i18next';

const styles = () => ({
    itemsFoundLabel: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

const CountDisplayerCmp = ({totalCount, classes}) => {
    const {t} = useTranslation('content-editor');

    return (
        <div className={classes.itemsFoundLabel} data-sel-total-count={totalCount}>
            <Typography color="gamma" variant="omega">
                {t('content-editor:label.contentEditor.edit.fields.contentPicker.itemsFound', {totalCount: totalCount})}
            </Typography>
        </div>
    );
};

CountDisplayerCmp.propTypes = {
    totalCount: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired
};

export const CountDisplayer = withStyles(styles)(CountDisplayerCmp);
