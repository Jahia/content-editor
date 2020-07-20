import {Select, Input} from '@jahia/design-system-kit';
import {withStyles, MenuItem} from '@material-ui/core';
import React, {useEffect} from 'react';
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

export const SingleSelectCmp = ({classes, field, value, id, setActionContext, onChange, onInit}) => {
    useEffect(() => {
        setActionContext(prevActionContext => ({
            initialized: true,
            contextHasChange: !prevActionContext.initialized ||
                // As action system make deep copy of formik each time value change we must update the context !
                prevActionContext.formik.values[field.name] !== value,
            onChange: onChange
        }));
    }, [setActionContext, field, value]);

    const readOnly = field.readOnly;

    // reset value if constraints doesnt contains the actual value.
    if (value && field.valueConstraints.find(v => v.value.string === value) === undefined) {
        onChange(undefined);
    }

    return (
        <Select
            className={`${classes.selectField}
                                    ${readOnly ? classes.readOnly : ''}`}
            value={value || ''}
            inputProps={{
                name: field.name,
                id: id
            }}
            input={<Input id={id} name={field.name} readOnly={readOnly}/>}
            onChange={evt => {
                onChange(evt.target.value);
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
};

SingleSelectCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    setActionContext: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onInit: PropTypes.func.isRequired
};

const SingleSelect = withStyles(styles)(SingleSelectCmp);
SingleSelect.displayName = 'SingleSelect';

export default SingleSelect;
