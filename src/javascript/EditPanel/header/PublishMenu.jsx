import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {useFormikContext} from 'formik';
import {Constants} from '~/ContentEditor.constants';
import React from 'react';
import styles from './UpperSection.scss';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils/getButtonRenderer';

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
    const {nodeData, lang} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();
    const formik = useFormikContext();
    const wipInfo = formik.values[Constants.wip.fieldName];
    const isWip = wipInfo.status === Constants.wip.status.ALL_CONTENT ||
        (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(lang));

    // Todo "formik.dirty || envProps.dirtyRef.current" is not very clear but required to get rerendered on formik state change
    let isDisabled = formik.dirty || nodeData.lockedAndCannotBeEdited || isWip || envProps.dirtyRef.current;

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
