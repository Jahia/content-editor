import React from 'react';
import {Toggle} from '@jahia/design-system-kit';
import {Typography} from '@jahia/moonstone';
import {FieldSetPropTypes} from '~/ContentEditor.proptypes';
import {FieldContainer} from '../../../Field';
import {useTranslation} from 'react-i18next';
import {useFormikContext} from 'formik';
import styles from '../../../FieldSet/FieldSet.scss';

export const ListSizeLimitFieldSet = ({fieldset}) => {
    const {values, handleChange} = useFormikContext();
    const {t} = useTranslation('content-editor');
    const isDynamicFieldSet = fieldset.dynamic;
    const activatedFieldSet = (values && values[fieldset.name]) || !isDynamicFieldSet;

    return (
        <article>
            <div className={styles.fieldsetTitleContainer}>
                <div className="flexRow alignCenter">
                    {isDynamicFieldSet && (
                        <Toggle
                            classes={{
                                switchBase: styles.toggle,
                                disabledSwitchBase: styles.toggle,
                                readOnlySwitchBase: styles.toggle,
                                focusedSwitchBase: styles.toggle
                            }}
                            data-sel-role-dynamic-fieldset={fieldset.name}
                            id={fieldset.name}
                            checked={activatedFieldSet}
                            readOnly={fieldset.readOnly}
                            onChange={handleChange}
                        />
                    )}
                    <Typography component="label"
                                htmlFor={fieldset.name}
                                className={styles.fieldSetTitle}
                                variant="subheading"
                    >
                        {t('content-editor:label.contentEditor.section.listSizeLimit.name')}
                    </Typography>
                </div>
                <Typography component="label" className={styles.fieldSetDescription} variant="caption">
                    {t('content-editor:label.contentEditor.section.listSizeLimit.description')}
                </Typography>
            </div>

            {activatedFieldSet && fieldset.fields.map(field => {
                return <FieldContainer key={field.name} field={field}/>;
            })}
        </article>
    );
};

ListSizeLimitFieldSet.propTypes = {
    fieldset: FieldSetPropTypes.isRequired
};

