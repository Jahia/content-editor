import {Badge, Paper} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ContentPreviewMemoWrapper} from './Preview';
import classes from './PreviewContainer.scss';

export const PreviewContainer = ({isDirty}) => {
    const {t} = useTranslation();

    return (
        <Paper className={classes.content}>
            <div className={classes.container}>
                {isDirty &&
                <div>
                    <Badge className={classes.badge}
                           badgeContent={t('content-editor:label.contentEditor.preview.updateOnSave')}
                           variant="normal"
                           color="info"
                    />
                </div>}
            </div>
            <ContentPreviewMemoWrapper/>
        </Paper>
    );
};

PreviewContainer.defaultProps = {
    isDirty: false
};

PreviewContainer.propTypes = {
    isDirty: PropTypes.bool
};

PreviewContainer.displayName = 'PreviewContainer';
