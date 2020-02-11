import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import {
    Control,
    MultiValue,
    MultiValueRemove,
    NoOptionsMessage,
    DropdownIndicator
} from './components';

const style = theme => ({
    noOptionsMessage: {
        padding: theme.spacing.unit
    }
});

const EmptyCmp = () => '';

const MultipleInputComponent = ({classes, creatable, async, readOnly, ...props}) => {
    const Cmp = creatable ? async ? AsyncCreatableSelect : CreatableSelect : Select;
    const components = {
        MultiValue,
        MultiValueRemove,
        IndicatorSeparator: EmptyCmp,
        Control,
        NoOptionsMessage,
        DropdownIndicator: creatable ? EmptyCmp : DropdownIndicator
    };

    const [selection, setSelection] = useState();
    const handleChange = selection => {
        setSelection(selection);
        props.onChange(selection);
    };

    return (
        <>
            <Cmp
                isMulti
                isClearable={false}
                components={components}
                value={selection}
                styles={classes}
                isDisabled={readOnly}
                {...props}
                isReadOnly={readOnly}
                onChange={handleChange}
            />
        </>
    );
};

MultipleInputComponent.defaut = {
    creatable: false,
    async: false,
    readOnly: false,
    onChange: () => {}
};

MultipleInputComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    readOnly: PropTypes.bool,
    creatable: PropTypes.bool,
    async: PropTypes.bool,
    onChange: PropTypes.func
};

export const MultipleInput = withStyles(style)(MultipleInputComponent);

MultipleInput.displayName = 'MultipleInput';
