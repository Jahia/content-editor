import {useContentEditorContext} from '~/ContentEditor.context';
import {useFormikContext} from 'formik';
import {Constants} from '~/ContentEditor.constants';
import React, {useMemo} from 'react';
import styles from './UpperSection.scss';
import {DisplayAction} from '@jahia/ui-extender';
import {ButtonRenderer} from '~/actions/ActionsButtons';

export const PublishMenu = () => {
    const {nodeData, lang} = useContentEditorContext();
    const formik = useFormikContext();
    const wipInfo = formik.values[Constants.wip.fieldName];
    const isWip = wipInfo.status === Constants.wip.status.ALL_CONTENT ||
        (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(language));

    let isDisabled = formik.dirty || nodeData.lockedAndCannotBeEdited || isWip;
    const componentProps = useMemo(() => ({
        'data-sel-role': 'ContentEditorHeaderMenu',
        color: 'accent',
        size: 'big',
        className: styles.menu,
        isDisabled: isDisabled
    }), [isDisabled]);

    return (
        <DisplayAction
            menuUseElementAnchor
            actionKey="publishMenu"
            language={lang}
            path={nodeData.path}
            componentProps={componentProps}
            render={ButtonRenderer}
        />
    );
};
