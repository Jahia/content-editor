import React from 'react';
import {FullWidthContent, TwoColumnsContent} from '@jahia/design-system-kit';
import FormBuilder from './FormBuilder';
import {PreviewContainer} from './Preview';
import PublicationInfoProgress from '~/PublicationInfo/PublicationInfoProgress';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {Constants} from '~/ContentEditor.constants';
import styles from './EditPanelContent.scss';

export const EditPanelContent = () => {
    const {mode, envProps} = useContentEditorConfigContext();
    const {hasPreview} = useContentEditorContext();

    return (
        <>
            {mode === Constants.routes.baseEditRoute && <PublicationInfoProgress/>}
            {hasPreview && (!envProps || !envProps.isModal || envProps.isFullscreen) ?
                (
                    <TwoColumnsContent
                        classes={{root: styles.twoColumnsRoot, left: styles.col, right: styles.col}}
                        rightCol={<PreviewContainer/>}
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

export default EditPanelContent;
