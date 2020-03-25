import React from 'react';
import {Chip} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import {getChipContent, showChipHeader} from '~/EditPanel/WorkInProgress/WorkInProgress.utils';

export const WipInfoChip = () => {
    const {t} = useTranslation();
    const {nodeData, lang} = useContentEditorContext();

    return (
        <>
            {showChipHeader(nodeData, lang) &&
                <Chip
                    data-sel-role="wip-info-chip"
                    label={getChipContent(nodeData, lang, t)}
                />}
        </>
    );
};

export default WipInfoChip;
