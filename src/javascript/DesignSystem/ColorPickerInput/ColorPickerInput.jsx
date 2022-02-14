import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover/Popover';
import {Input} from '@jahia/design-system-kit';
import {IconButton} from '@material-ui/core';
import {Palette} from '@material-ui/icons';
import {Constants} from '~/ContentEditor.constants';
import {HexColorPicker} from 'react-colorful';

const styles = theme => ({
    root: {
        borderLeft: '24px solid #000'
    },
    overlay: {
        overflowY: 'initial',
        overflowX: 'initial'
    },
    colorPickerIcon: {
        color: theme.palette.font.gamma + ' !important'
    }
});

const defaultVisualColor = '#fff';
const getVisualValue = value => {
    return value && Constants.color.hexColorRegexp.test(value) ? value : defaultVisualColor;
};

const ColorPickerInputCmp = ({classes, onChange, initialValue, readOnly, inputProps}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [internalValue, setInternalValue] = useState(initialValue);
    const htmlInput = useRef();

    useEffect(() => {
        setInternalValue(initialValue);
    }, [initialValue, setInternalValue]);

    const handleOpenPicker = () => {
        if (!readOnly) {
            setAnchorEl(htmlInput.current.parentElement);
        }
    };

    const InteractiveVariant = (
        <IconButton aria-label="Open color picker"
                    classes={{
                        root: classes.colorPickerIcon
                    }}
                    onClick={handleOpenPicker}
        >
            <Palette/>
        </IconButton>
    );

    return (
        <div className={classes.root} style={{borderColor: getVisualValue(internalValue)}}>
            <Input
                inputRef={htmlInput}
                data-sel-readonly={readOnly}
                variant={{
                    interactive: InteractiveVariant
                }}
                readOnly={readOnly}
                value={internalValue}
                onChange={e => {
                    if (e && e.target) {
                        onChange(e.target.value);
                    }
                }}
                {...inputProps}
            />
            <Popover open={Boolean(anchorEl)}
                     anchorEl={anchorEl}
                     anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'left'
                     }}
                     transformOrigin={{
                         vertical: 'top',
                         horizontal: 'left'
                     }}
                     classes={{
                         paper: classes.overlay
                     }}
                     onClose={() => {
                         setAnchorEl(null);
                         onChange(internalValue);
                     }}
            >
                <HexColorPicker
                    color={internalValue}
                    onChange={newColor => {
                        setInternalValue(newColor);
                    }}
                />
            </Popover>
        </div>
    );
};

ColorPickerInputCmp.defaultProps = {
    onChange: () => {},
    initialValue: null,
    readOnly: false,
    inputProps: {}
};

ColorPickerInputCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    initialValue: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    inputProps: PropTypes.object
};

export const ColorPickerInput = withStyles(styles)(ColorPickerInputCmp);
ColorPickerInput.displayName = 'ColorPickerInput';
