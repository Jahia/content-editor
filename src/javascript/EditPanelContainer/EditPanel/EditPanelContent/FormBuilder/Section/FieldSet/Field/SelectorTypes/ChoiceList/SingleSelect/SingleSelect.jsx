import {Select} from '@jahia/design-system-kit';
import Input from '@material-ui/core/Input';
import {withStyles, MenuItem} from '@material-ui/core';
import {FastField} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/EditPanelContainer/FormDefinitions/FormData.proptypes';

const styles = () => ({
    selectField: {
        width: '100%'
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
                    setFieldTouched(field.name, true);
                };

                setActionContext(prevActionContext => ({
                    initialized: true,
                    menuDisplayDisabled: true,
                    contextHasChange: !prevActionContext.initialized ||
                        // As action system make deep copy of formik each time value change we must update the context !
                        prevActionContext.formik.values[field.name] !== formikField.value
                }));

                return (
                    <Select className={classes.selectField}
                            onChange={handleChange}
                            {...formikField}
                            // eslint-disable-next-line react/prop-types
                            value={formikField.value || ''}
                            inputProps={{
                                name: field.name,
                                id: id
                            }}
                            input={<Input id={id} name={field.name} readOnly={field.readOnly}/>}
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
