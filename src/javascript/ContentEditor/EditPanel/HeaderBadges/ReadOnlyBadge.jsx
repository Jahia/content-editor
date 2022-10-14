import React from 'react';
import {Chip, Visibility} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from "~/contexts";

export const ReadOnlyBadgeGlobal = () => {
    const {nodeData} = useContentEditorContext();

    if (!nodeData || !nodeData.lockedAndCannotBeEdited) {
        return null;
    }

    return (
        <ReadOnlyBadge/>
    );
};

export const ReadOnlyBadge = () => {
    const {t} = useTranslation('content-editor');

    return (
        <Chip
            data-sel-role="lock-info-badge"
            label={t("content-editor:label.contentEditor.readOnly")}
            icon={<Visibility/>}
            color="warning"
        />
    );
};
