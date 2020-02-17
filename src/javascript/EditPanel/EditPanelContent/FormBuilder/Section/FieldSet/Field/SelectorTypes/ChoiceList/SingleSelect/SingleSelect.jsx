import {Select, Input} from '@jahia/design-system-kit';
import {withStyles, MenuItem} from '@material-ui/core';
import {FastField} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';

const styles = theme => ({
    selectField: {
        width: '100%'
    },
    readOnly: {
        outline: 'none',
        background: theme.palette.ui.alpha,
        border: `1px solid ${theme.palette.ui.alpha}!important`,
        '& div': {
            cursor: 'default'
        }
    }
});

export const SingleSelectCmp = ({classes, field, id, setActionContext}) => {
    return (
        <FastField
            name={field.name}
            render={props => {
                const {onChange, ...formikField} = props.field;
                // eslint-disable-next-line react/prop-types
                const {setFieldTouched} = props.form;
                const handleChange = evt => {
                    onChange(evt);
                    setFieldTouched(field.name, field.multiple ? [true] : true);
                };

                setActionContext(prevActionContext => ({
                    initialized: true,
                    menuDisplayDisabled: true,
                    contextHasChange: !prevActionContext.initialized ||
                        // As action system make deep copy of formik each time value change we must update the context !
                        prevActionContext.formik.values[field.name] !== formikField.value
                }));

                const readOnly = field.readOnly;

                return (
                    <Select
                        className={`${classes.selectField}
                                    ${readOnly ? classes.readOnly : ''}`}
                        onChange={handleChange}
                        {...formikField}
                        // eslint-disable-next-line react/prop-types
                        value={formikField.value || ''}
                        inputProps={{
                            name: field.name,
                            id: id
                        }}
                        input={<Input id={id} name={field.name} readOnly={readOnly}/>}
                        onBlur={() => {
                            /* Do Nothing on blur BACKLOG-10095 */
                        }}
                    >
                        {
                            field.valueConstraints.map(item => {
                                return (
                                    <MenuItem key={item.value.string} value={item.value.string}>{item.displayValue}</MenuItem>
                                );
                            })
                        }
                    </Select>
                );
            }}
        />
    );
};

SingleSelectCmp.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    setActionContext: PropTypes.func.isRequired
};

const SingleSelect = withStyles(styles)(SingleSelectCmp);
SingleSelect.displayName = 'SingleSelect';

export default SingleSelect;
