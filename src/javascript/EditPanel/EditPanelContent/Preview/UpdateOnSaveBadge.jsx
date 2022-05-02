import {useFormikContext} from 'formik';
import {Badge} from '@jahia/design-system-kit';
import classes from './Preview.container.scss';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useContentEditorConfigContext} from '~/ContentEditor.context';

export const UpdateOnSaveBadge = () => {
    const formik = useFormikContext();
    const {envProps} = useContentEditorConfigContext();
    // todo "formik.dirty || envProps.dirtyRef.current" is not very clear but required to get rerendered on formik state change
    const dirty = formik.dirty || envProps.dirtyRef.current;
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
