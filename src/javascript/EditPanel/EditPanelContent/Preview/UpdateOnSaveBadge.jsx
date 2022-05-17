import {useFormikContext} from 'formik';
import {Badge} from '@jahia/design-system-kit';
import classes from './Preview.container.scss';
import React from 'react';
import {useTranslation} from 'react-i18next';

export const UpdateOnSaveBadge = () => {
    const formik = useFormikContext();
    const dirty = formik.dirty;
    const {t} = useTranslation('content-editor');

    return dirty && (
        <div>
            <Badge className={classes.badge}
                   badgeContent={t('content-editor:label.contentEditor.preview.updateOnSave')}
                   variant="normal"
                   color="info"
            />
        </div>
    );
};
