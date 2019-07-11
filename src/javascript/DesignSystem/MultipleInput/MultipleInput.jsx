import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
    Control,
    MultiValue,
    NoOptionsMessage,
    DropdownIndicator,
    Option
} from './components';

const style = theme => ({
    noOptionsMessage: {
        padding: theme.spacing.unit
    }
});

const EmptyCmp = () => '';

const MultipleInputComponent = ({classes, creatable, readOnly, ...props}) => {
    const Cmp = creatable ? CreatableSelect : Select;

    const components = {
        MultiValue,
        Control,
        NoOptionsMessage,
        IndicatorSeparator: EmptyCmp,
        DropdownIndicator: creatable ? EmptyCmp : DropdownIndicator,
        Option
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
                onChange={handleChange}
            />
        </>
    );
};

MultipleInputComponent.defaut = {
    creatable: false,
    readOnly: false,
    onChange: () => {}
};

MultipleInputComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    readOnly: PropTypes.bool,
    creatable: PropTypes.bool,
    onChange: PropTypes.func
};

export const MultipleInput = withStyles(style)(MultipleInputComponent);

MultipleInput.displayName = 'MultipleInput';
