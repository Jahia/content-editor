import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Popover} from '@material-ui/core';
import {Input} from '@jahia/design-system-kit';
import {Constants} from '~/ContentEditor.constants';
import {HexColorPicker} from 'react-colorful';
import {Button, Palette} from '@jahia/moonstone';
import styles from './ColorPickerInput.scss';

const defaultVisualColor = '#fff';
const getVisualValue = value => {
    return value && Constants.color.hexColorRegexp.test(value) ? value : defaultVisualColor;
};

export const ColorPickerInput = ({onChange, onBlur, initialValue, readOnly, inputProps}) => {
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
        <Button aria-label="Open color picker"
                variant="ghost"
                icon={<Palette/>}
                onClick={handleOpenPicker}
        />
    );

    return (
        <div className={styles.root} style={{borderColor: getVisualValue(internalValue)}}>
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
                onBlur={onBlur}
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
                         paper: styles.overlay
                     }}
                     onClose={() => {
                         setAnchorEl(null);
                         onChange(internalValue);
                         onBlur();
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

ColorPickerInput.defaultProps = {
    onChange: () => {},
    initialValue: null,
    readOnly: false,
    inputProps: {}
};

ColorPickerInput.propTypes = {
    initialValue: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool,
    inputProps: PropTypes.object
};

ColorPickerInput.displayName = 'ColorPickerInput';
