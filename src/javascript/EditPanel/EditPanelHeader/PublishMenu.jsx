import {useContentEditorContext} from '~/ContentEditor.context';
import {useFormikContext} from 'formik';
import {Constants} from '~/ContentEditor.constants';
import React from 'react';
import styles from './PublishMenu.scss';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';

const ButtonRenderer = getButtonRenderer({
    labelStyle: 'none',
    defaultButtonProps: {
        size: 'big',
        color: 'accent',
        className: styles.menu,
        'data-sel-role': 'ContentEditorHeaderMenu'
    }
});

export const PublishMenu = () => {
    const {nodeData, lang, i18nContext} = useContentEditorContext();
    const formik = useFormikContext();
    const wipInfo = formik.values[Constants.wip.fieldName];
    const isWip = wipInfo.status === Constants.wip.status.ALL_CONTENT ||
        (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(lang));

    const dirty = formik.dirty || Object.keys(i18nContext).length > 0;
    let isDisabled = dirty || nodeData.lockedAndCannotBeEdited || isWip;

    return (
        <DisplayAction
            menuUseElementAnchor
            disabled={isDisabled}
            actionKey="publishMenu"
            language={lang}
            path={nodeData.path}
            render={ButtonRenderer}
        />
    );
};
