import PropTypes from 'prop-types';
import React from 'react';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {Text} from '~/SelectorTypes/Text';
import {Constants} from '~/ContentEditor.constants';
import {isEqualToSystemName, replaceSpecialCharacters} from './SystemName.utils';
import {Button, Copy} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './SystemName.scss';
import {useFormikContext} from 'formik';

export const SystemName = ({field, value, id, editorContext, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const formik = useFormikContext();
    const titleField = Object.keys(formik.values).find(key => key.endsWith('_jcr:title'));
    return (
        <>
            <Text
                field={{...field, readOnly: field.readOnly || Boolean(editorContext.name && editorContext.mode === Constants.routes.baseCreateRoute)}}
                value={value}
                id={id}
                editorContext={editorContext}
                onChange={onChange}
                onBlur={onBlur}
            />

            {formik.values[titleField] !== undefined &&
            editorContext.mode === Constants.routes.baseEditRoute &&
            <Button className={styles.syncButton}
                    data-sel-role="syncSystemName"
                    variant="outlined"
                    size="big"
                    color="accent"
                    label={t('content-editor:label.contentEditor.section.fieldSet.system.fields.syncButton')}
                    icon={<Copy/>}
                    isDisabled={field.readOnly || isEqualToSystemName(formik.values[titleField], value, field)}
                    onClick={() => {
                        onChange(replaceSpecialCharacters(formik.values[titleField], field));
                    }}
            />}
        </>
    );
};

SystemName.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};

