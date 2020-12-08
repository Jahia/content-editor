import {Select, Input} from '@jahia/design-system-kit';
import {withStyles, MenuItem} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'clsx';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {Dropdown, Button, Badge} from '@jahia/moonstone';

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

export const SingleSelectCmp = ({classes, field, value, id, setActionContext, onChange}) => {
    setActionContext({
        onChange
    });

    const readOnly = field.readOnly || field.valueConstraints.length === 0;
    const label = value ? field.valueConstraints.find(item => item.value.string === value).displayValue : '';
    const dropdownData = field.valueConstraints.map(item => ({
        label: item.displayValue,
        value: item.value.string
    }));

    // Reset value if constraints doesnt contains the actual value.
    if (value && field.valueConstraints.find(v => v.value.string === value) === undefined) {
        onChange(null);
    }

    return (
        <>
            <Select
                className={`${classes.selectField} ${readOnly ? classes.readOnly : ''}`}
                value={value || ''}
                inputProps={{
                    name: field.name,
                    id: id,
                    'data-sel-content-editor-select-readonly': readOnly
                }}
                input={<Input id={id} name={field.name} readOnly={readOnly}/>}
                onChange={evt => {
                    if (evt.target.value !== value) {
                        onChange(evt.target.value);
                    }
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
            <Dropdown
                name={field.name}
                isDisabled={readOnly}
                maxWidth="100%"
                variant="outlined"
                size="medium"
                data={dropdownData}
                label={label}
                value={value || ''}
                onChange={(evt, item) => {
                    if (item.value !== value) {
                        onChange(item.value);
                    }
                }}
            />
        </>
    );
};

SingleSelectCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    setActionContext: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

const SingleSelect = withStyles(styles)(SingleSelectCmp);
SingleSelect.displayName = 'SingleSelect';

export default SingleSelect;
