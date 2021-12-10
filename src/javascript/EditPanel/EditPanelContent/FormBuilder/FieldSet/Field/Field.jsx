import React, {useEffect, useRef} from 'react';
import {InputLabel, withStyles} from '@material-ui/core';
import {Badge, Typography} from '@jahia/design-system-kit';
import {Public} from '@material-ui/icons';
import {useTranslation} from 'react-i18next';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions';
import {MultipleField} from './MultipleField';
import {SingleField} from './SingleField';
import {showChipField} from '~/EditPanel/WorkInProgress/WorkInProgress.utils';
import {Constants} from '~/ContentEditor.constants';
import {buildFlatFieldObject} from './field.utils';
import {DisplayAction, registry} from '@jahia/ui-extender';
import contentEditorHelper from '~/ContentEditor.helper';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {useApolloClient} from '@apollo/react-hooks';
import {FieldActions} from './Field.actions';
import {Button} from "@jahia/moonstone";

let styles = theme => {
    const common = {
        transform: 'none!important',
        position: 'relative',
        marginBottom: theme.spacing.unit
    };

    return {
        formControl: {
            ...theme.typography.zeta,
            ...common,
            padding: '8px 0',
            paddingLeft: '8px',
            marginLeft: '20px ',
            borderLeft: '4px solid transparent'
        },
        formControlError: {
            borderLeft: `4px solid ${theme.palette.moonstone.support.warning60}`
        },
        errorMessage: {
            marginTop: '4px',
            color: theme.palette.moonstone.support.warning
        },
        inputLabel: {
            ...theme.typography.zeta,
            ...common,
            color: theme.palette.font.beta,
            display: 'inline-block'
        },
        emptySpace: {
            display: 'block',
            width: 48
        },
        badge: {
            marginBottom: theme.spacing.unit,
            position: 'sticky'
        }
    };
};

export const FieldCmp = ({classes, inputContext, idInput, selectorType, field, formik}) => {
    const {t} = useTranslation('content-editor');
    const editorContext = useContentEditorContext();
    const sectionsContext = useContentEditorSectionContext();
    const client = useApolloClient();

    const {errors, values, setFieldValue, setFieldTouched} = formik;
    const onChangeValue = useRef(undefined);

    const isMultipleField = field.multiple && !selectorType.supportMultiple;
    const seleniumFieldType = isMultipleField ? `GenericMultipleField${selectorType.key}` : (field.multiple ? `Multiple${selectorType.key}` : selectorType.key);
    const shouldDisplayErrors = errors[field.name];
    const splitError = shouldDisplayErrors && errors[field.name].split('_');
    const errorName = splitError && splitError.length > 0 && splitError[0];
    const errorArgs = splitError && splitError.length > 1 ? splitError.splice(1) : [];
    const hasMandatoryError = shouldDisplayErrors && errors[field.name] === 'required';
    const wipInfo = values[Constants.wip.fieldName];

    // Lookup for registered on changes for given field selector type
    const registeredOnChanges = [...registry.find({type: 'selectorType.onChange', target: selectorType.key}), ...registry.find({type: 'selectorType.onChange', target: '*'})];
    const registeredOnChange = currentValue => {
        if (registeredOnChanges && registeredOnChanges.length > 0) {
            registeredOnChanges.forEach(registeredOnChange => {
                if (registeredOnChange.onChange) {
                    const onChangeContext = {...editorContext, ...sectionsContext, formik, client};
                    try {
                        registeredOnChange.onChange(onChangeValue.current, currentValue, field, onChangeContext, selectorType, contentEditorHelper);
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        }

        onChangeValue.current = currentValue;
    };

    const onChange = currentValue => {
        // Update formik
        setFieldValue(field.name, currentValue, true);
        // Validation has been done on the setValue, no need to redo it on touch.
        setFieldTouched(field.name, field.isMultiple ? [true] : true, false);

        // Trigger on changes
        registeredOnChange(currentValue);
    };

    useEffect(() => {
        if (values[field.name] !== null && values[field.name] !== undefined) {
            // Init
            registeredOnChange(values[field.name]);
        }
        // Unmount

        return () => registeredOnChange(undefined);
    }, []);

    return (
        <div className={`${classes.formControl} ${shouldDisplayErrors ? classes.formControlError : ''}`}
             data-sel-content-editor-field={field.name}
             data-sel-content-editor-field-type={seleniumFieldType}
             data-sel-content-editor-field-readonly={field.readOnly}
        >
                <div className="flexFluid">
                    {inputContext.displayLabels &&
                        <div className="flexRow">
                            <InputLabel shrink
                                        id={`${field.name}-label`}
                                        className={classes.inputLabel}
                                        htmlFor={isMultipleField ? null : idInput}
                            >
                                {field.displayName}
                            </InputLabel>
                            {inputContext.displayBadges && (
                                <>
                                    {field.mandatory && (
                                        <Badge className={classes.badge}
                                               data-sel-content-editor-field-mandatory={Boolean(hasMandatoryError)}
                                               badgeContent={t('content-editor:label.contentEditor.edit.validation.required')}
                                               variant="normal"
                                               color={hasMandatoryError ? 'warning' : 'info'}
                                        />
                                    )}
                                    {showChipField(field.i18n, wipInfo, editorContext.lang) && (
                                        <Badge className={classes.badge}
                                               data-sel-role="wip-info-chip-field"
                                               badgeContent={t('content-editor:label.contentEditor.edit.action.workInProgress.chipLabelField')}
                                               variant="normal"
                                               color="info"
                                        />
                                    )}
                                    {(!field.i18n && editorContext.siteInfo.languages.length > 1) &&
                                    <Badge className={classes.badge}
                                           badgeContent={t('content-editor:label.contentEditor.edit.sharedLanguages')}
                                           icon={<Public/>}
                                           variant="normal"
                                           color="primary"
                                    />}
                                </>
                            )}
                            <div className="flexFluid"/>
                            <DisplayAction
                                actionKey="content-editor/field/3dots" formik={formik} editorContext={editorContext} field={field} selectorType={selectorType}
                                render={({dataSelRole, isVisible, enabled, isDisabled, buttonIcon, onClick, ...props}) => {
                                    return isVisible && (
                                        <Button
                                            data-sel-role={dataSelRole}
                                            icon={buttonIcon}
                                            variant="ghost"
                                            onClick={e => {
                                                e.stopPropagation();
                                                onClick(props, e);
                                            }}
                                        />
                                    )
                                }}
                            />
                        </div>
                    }
                    {field.description && (
                        <Typography color="beta" variant="omega">
                            {field.description}
                        </Typography>
                    )}
                    <div className="flexRow_nowrap alignCenter">
                        <div className="flexFluid">
                            {isMultipleField ?
                                <MultipleField inputContext={inputContext}
                                               editorContext={editorContext}
                                               field={field}
                                               onChange={onChange}/> :
                                <SingleField inputContext={inputContext}
                                             editorContext={editorContext}
                                             field={field}
                                             onChange={onChange}/>}
                        </div>
                        <div>
                            <FieldActions inputContext={inputContext}
                                          selectorType={selectorType}
                                          field={field}/>
                        </div>
                    </div>
                    {inputContext.displayErrors && (
                        <Typography className={classes.errorMessage}
                                    data-sel-error={shouldDisplayErrors && errorName}
                        >
                            {shouldDisplayErrors ?
                                field.errorMessage ?
                                    field.errorMessage :
                                    t(`content-editor:label.contentEditor.edit.errors.${errorName}`, {...buildFlatFieldObject(field), ...errorArgs}) :
                                ''}&nbsp;
                        </Typography>
                    )}
                </div>
        </div>
    );
};

FieldCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    inputContext: PropTypes.object.isRequired,
    idInput: PropTypes.string.isRequired,
    selectorType: PropTypes.shape({
        key: PropTypes.string,
        supportMultiple: PropTypes.bool
    }).isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.shape({
        errors: PropTypes.object,
        touched: PropTypes.object,
        values: PropTypes.object,
        setFieldValue: PropTypes.func,
        setFieldTouched: PropTypes.func
    }).isRequired
};

export const Field = withStyles(styles)(FieldCmp);
Field.displayName = 'Field';
