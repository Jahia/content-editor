import React from 'react';
import {FullWidthContent, TwoColumnsContent} from '@jahia/design-system-kit';
import {FormBuilder} from './FormBuilder';
import {Preview} from './Preview';
import {PublicationInfoProgress} from './PublicationInfoProgress';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import {Constants} from '~/ContentEditor.constants';
import styles from './EditPanelContent.scss';

export const EditPanelContent = () => {
    const {mode, isFullscreen} = useContentEditorConfigContext();
    const {hasPreview} = useContentEditorContext();

    return (
        <>
            {mode === Constants.routes.baseEditRoute && <PublicationInfoProgress/>}
            {hasPreview && isFullscreen ?
                (
                    <TwoColumnsContent
                        classes={{root: styles.twoColumnsRoot, left: styles.col, right: styles.col}}
                        rightCol={<Preview/>}
                        data-sel-mode={mode}
                    >
                        <FormBuilder mode={mode}/>
                    </TwoColumnsContent>
                ) :
                (
                    <FullWidthContent
                        classes={{root: styles.fullWidthRoot}}
                        data-sel-mode={mode}
                    >
                        <FormBuilder mode={mode}/>
                    </FullWidthContent>
                )}
        </>
    );
};
