import {Select} from '@jahia/design-system-kit';
import Input from '@material-ui/core/Input';
import {withStyles, MenuItem} from '@material-ui/core';
import {Field} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '../../../../../FormDefinitions/FromData.proptypes';

const styles = () => ({
    selectField: {
        width: '100%'
    }
});

const ChoiceList = ({classes, field, id}) => {
    return (
        <Field
            name={field.formDefinition.name}
            render={props => {
                const {name, value, onChange} = props.field;

                return (
                    <Select className={classes.selectField}
                            name={name}
                            // eslint-disable-next-line react/prop-types
                            value={value || ''}
                            inputProps={{
                                name: field.formDefinition.name,
                                id: id
                            }}
                            input={<Input id={id} name={field.formDefinition.name} readOnly={field.formDefinition.readOnly}/>}
                            onChange={onChange}
                    >
                        {
                            field.formDefinition.valueConstraints.map(item => {
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

ChoiceList.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ChoiceList);
