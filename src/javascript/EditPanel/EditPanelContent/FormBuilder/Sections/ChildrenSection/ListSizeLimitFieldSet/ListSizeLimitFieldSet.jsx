import React from 'react';

import {withStyles} from '@material-ui/core';
import {Toggle} from '@jahia/design-system-kit';
import {Typography} from '@jahia/moonstone';
import {compose} from '~/utils';
import {FieldSetPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FieldContainer} from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet/Field';
import {useTranslation} from 'react-i18next';
import {useFormikContext} from 'formik';
import styles from '../../../FieldSet/FieldSet.scss';

const ListSizeLimitFieldSet = ({fieldset}) => {
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

export const FieldSet = compose(
    withStyles(styles)
)(ListSizeLimitFieldSet);

FieldSet.displayName = 'ListSizeLimitFieldSet';
