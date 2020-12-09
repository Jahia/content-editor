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
    const {t} = useTranslation();

    const titleField = Object.keys(values).find(key => key.endsWith('_jcr:title'));
    return (
        <>
            <Text
                field={{...field, readOnly: field.readOnly || Boolean(editorContext.name && editorContext.mode === Constants.routes.baseCreateRoute)}}
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
