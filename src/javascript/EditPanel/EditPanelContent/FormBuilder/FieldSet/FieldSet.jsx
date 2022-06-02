import React from 'react';
import {Toggle} from '@jahia/design-system-kit';
import {Typography} from '@jahia/moonstone';
import {FieldSetPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FieldContainer} from './Field';
import {useFormikContext} from 'formik';
import styles from './FieldSet.scss';
import clsx from 'clsx';

const DynamicFieldSet = ({fieldset}) => {
    const {values, handleChange} = useFormikContext();
    const activatedFieldSet = (values && values[fieldset.name]);
    return (
        <article>
            <div className={styles.fieldsetTitleContainer}>
                <div className="flexRow alignCenter">
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
                    <Typography component="label"
                                htmlFor={fieldset.name}
                                className={styles.fieldSetTitle}
                                variant="subheading"
                    >
                        {fieldset.displayName}
                    </Typography>
                </div>
                {fieldset.description && (
                    <Typography component="label" className={styles.fieldSetDescription} variant="caption">
                        {fieldset.description}
                    </Typography>
                )}
            </div>

            {activatedFieldSet && fieldset.fields.map(field => <FieldContainer key={field.name} field={field}/>)}
        </article>
    );
};

DynamicFieldSet.propTypes = {
    fieldset: FieldSetPropTypes.isRequired
};

const StaticFieldSet = ({fieldset}) => {
    return (
        <article>
            <div className={styles.fieldsetTitleContainer}>
                <div className="flexRow alignCenter">
                    <Typography component="label"
                                htmlFor={fieldset.name}
                                className={styles.fieldSetTitle}
                                variant="subheading"
                    >
                        {fieldset.displayName}
                    </Typography>
                </div>
                {fieldset.description && (
                    <Typography component="label" className={clsx(styles.fieldSetDescription, styles.staticFieldSetDescription)} variant="caption">
                        {fieldset.description}
                    </Typography>
                )}
            </div>

            {fieldset.fields.map(field => <FieldContainer key={field.name} field={field}/>)}
        </article>
    );
};

StaticFieldSet.propTypes = {
    fieldset: FieldSetPropTypes.isRequired
};

export const FieldSet = ({fieldset}) => {
    return fieldset.dynamic ? (
        <DynamicFieldSet fieldset={fieldset}/>
    ) : (
        <StaticFieldSet fieldset={fieldset}/>
    );
};

FieldSet.propTypes = {
    fieldset: FieldSetPropTypes.isRequired
};

FieldSet.displayName = 'FieldSet';
