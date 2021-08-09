import PropTypes from 'prop-types';
import React from 'react';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import Text from '~/SelectorTypes/Text';
import {Constants} from '~/ContentEditor.constants';
import {limitSystemNameIfNecessary, replaceSpecialCharacters, isEqualToSystemName} from './SystemName.utils';
import {Button, Copy} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import classes from './SystemName.scss';

export const SystemNameCmp = ({field, value, values, id, editorContext, onChange}) => {
    const {t} = useTranslation('content-editor');

    const titleField = Object.keys(values).find(key => key.endsWith('_jcr:title'));
    return (
        <>
            <Text
                field={{...field, readOnly: field.readOnly ||
                        Boolean(editorContext.name && editorContext.mode === Constants.routes.baseCreateRoute ||
                        // Fixes 404 when user edits systemname in page composer, applies only to page composer and can be safely removed once editor is not used with page composer
                        Boolean(editorContext.mode !== Constants.routes.baseCreateRoute && window.location.pathname.match(/\/page-composer\//g) !== null))}}
                value={value}
                id={id}
                editorContext={editorContext}
                onChange={onChange}
            />

            {values[titleField] !== undefined &&
            editorContext.mode === Constants.routes.baseEditRoute &&
            <Button className={classes.syncButton}
                    data-sel-role="syncSystemName"
                    variant="outlined"
                    size="big"
                    color="accent"
                    label={t('content-editor:label.contentEditor.section.fieldSet.system.fields.syncButton')}
                    icon={<Copy/>}
                    isDisabled={field.readOnly || isEqualToSystemName(values[titleField], value, field)}
                    onClick={() => {
                        const cleanedSystemName = replaceSpecialCharacters(values[titleField])?.toLowerCase();
                        onChange(limitSystemNameIfNecessary(cleanedSystemName, field));
                    }}
            />}
        </>
    );
};

SystemNameCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    values: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired
};

const SystemName = SystemNameCmp;
SystemName.displayName = 'SystemName';
export default SystemName;
