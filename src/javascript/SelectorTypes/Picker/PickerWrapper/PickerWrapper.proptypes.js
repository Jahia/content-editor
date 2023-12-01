import PropTypes from 'prop-types';

export const PickerWrapperConfigPropsTypes = PropTypes.shape({
    module: PropTypes.string.isRequired,
    selectableTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    key: PropTypes.string.isRequired,
    pickerInput: PropTypes.shape({
        usePickerInputData: PropTypes.elementType.isRequired,
        emptyLabel: PropTypes.string,
        emptyIcon: PropTypes.string
    }),
    pickerDialog: PropTypes.shape({
        cmp: PropTypes.elementType.isRequired,
        label: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string
    })
});
export const DamPropsTypes = PropTypes.shape({
    pickerConfigsEnabled: PropTypes.array.isRequired,
    currentPickerConfiguration: PickerWrapperConfigPropsTypes.isRequired
    // ValueTypes: PropTypes.array
});
