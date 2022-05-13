import React, {useCallback, useEffect, useMemo, useRef} from 'react';
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
import {getButtonRenderer} from '../../../../../utils/getButtonRenderer';
import {useFormikContext} from 'formik';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

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
            padding: '8px 0 8px 0',
            borderLeft: '4px solid transparent'
        },
        formControlError: {
            padding: '8px 0 8px 8px',
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
        actions: {
            display: 'block',
            width: 48
        },
        badge: {
            marginBottom: theme.spacing.unit,
            position: 'sticky'
        }
    };
};

export const FieldCmp = ({classes, inputContext, idInput, selectorType, field}) => {
    const {t} = useTranslation('content-editor');
    const formik = useFormikContext();
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
    const registeredOnChanges = useMemo(() => [...registry.find({
        type: 'selectorType.onChange',
        target: selectorType.key
    }), ...registry.find({type: 'selectorType.onChange', target: '*'})], [selectorType.key]);

    const onChangeContext = useRef({});
    useEffect(() => {
        onChangeContext.current = {...editorContext, ...sectionsContext, formik, client};
    }, [editorContext, sectionsContext, formik, client]);

    const registeredOnChange = useCallback(currentValue => {
        if (registeredOnChanges && registeredOnChanges.length > 0) {
            registeredOnChanges.forEach(currentOnChange => {
                if (currentOnChange.onChange) {
                    try {
                        currentOnChange.onChange(onChangeValue.current, currentValue, field, onChangeContext.current, selectorType, contentEditorHelper);
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        }

        onChangeValue.current = currentValue;
    }, [field, registeredOnChanges, selectorType]);

    const onChange = useCallback(currentValue => {
        // Update formik
        setFieldValue(field.name, currentValue);
        // Validation has been done on the setValue, no need to redo it on touch.
        setFieldTouched(field.name, field.isMultiple ? [true] : true, false);

        // Trigger on changes
        registeredOnChange(currentValue);
    }, [field.isMultiple, field.name, registeredOnChange, setFieldTouched, setFieldValue]);

    const registeredOnChangeRef = useRef(registeredOnChange);
    useEffect(() => {
        registeredOnChangeRef.current = registeredOnChange;
    }, [registeredOnChange]);

    const initialValue = useRef(values[field.name]);

    useEffect(() => {
        if (initialValue.current !== null && initialValue.current !== undefined) {
            // Init
            registeredOnChangeRef.current(initialValue.current);
        }

        // Unmount
        return () => {
            registeredOnChangeRef.current(undefined);
        };
    }, []);

    const firstField = sectionsContext.sections ? sectionsContext.sections[0]?.fieldSets[0]?.fields[0] === field : false;

    return (
        <div className={`${classes.formControl} ${shouldDisplayErrors ? classes.formControlError : ''}`}
             data-first-field={firstField}
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
                        actionKey="content-editor/field/3dots"
                        editorContext={editorContext}
                        field={field}
                        selectorType={selectorType}
                        render={ButtonRenderer}
                    />
                </div>}
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
                    {inputContext.displayActions && registry.get('action', selectorType.key + 'Menu') && (
                        <div className={classes.actions}>
                            <DisplayAction actionKey={selectorType.key + 'Menu'}
                                           field={field}
                                           selectorType={selectorType}
                                           inputContext={inputContext}
                                           render={ButtonRenderer}
                            />
                        </div>
                    )}
                    {inputContext.actionRender && (
                        <div>
                            {inputContext.actionRender}
                        </div>
                    )}
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
    field: FieldPropTypes.isRequired
};

const FieldStyled = withStyles(styles)(FieldCmp);
FieldStyled.displayName = 'FieldStyled';

export const Field = (FieldStyled);

Field.displayName = 'Field';
