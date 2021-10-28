
import React, {useRef} from 'react';
import {ContextualMenu, registry} from '@jahia/ui-extender';
import {IconButton} from '@jahia/design-system-kit';
import {MoreVert} from '@material-ui/icons';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import PropTypes from 'prop-types';

export default function Field3dots({field, formik}) {
    const {t} = useTranslation('content-editor');
    const contextualMenu = useRef();
    let menuItems = registry.find({
        target: 'content-editor/field/3dots'
    });

    const ceContext = useContentEditorContext();
    let isVisible = field.i18n || ceContext.siteInfo.languages.length <= 1;
    if (!isVisible) {
        return null;
    }

    return (
        <>
            <ContextualMenu
                actionKey="content-editor/field/3dots"
                setOpenRef={contextualMenu}/>
            <IconButton variant="ghost"
                        data-sel-action="moreOptions"
                        aria-label={t('content-editor:label.contentEditor.edit.action.fieldMoreOptions')}
                        icon={<MoreVert/>}
                        onClick={event => {
                            event.stopPropagation();
                            contextualMenu.current(event, {field, formik, ceContext});
                        }}/>
        </>
    );
}

Field3dots.propTypes = {
    formik: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired
};
